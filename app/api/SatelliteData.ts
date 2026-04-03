/**
 * N2YO REST API — visual satellite passes (free tier; requires API key).
 * Set EXPO_PUBLIC_N2YO_API_KEY in project-root .env (see https://www.n2yo.com/api/).
 */

export const NORAD_ISS = 25544;

/** Curated LEO targets; NORAD ids — verify periodically after major launches. */
export const CURATED_SATELLITES: { noradId: number; label?: string }[] = [
  { noradId: 25544, label: "ISS" },
  { noradId: 20580, label: "Hubble" },
  { noradId: 33591, label: "NOAA-19" },
  { noradId: 38771, label: "MetOp-B" },
  { noradId: 25994, label: "Terra" },
  { noradId: 27424, label: "Aqua" },
  { noradId: 37849, label: "Suomi NPP" },
  { noradId: 48274, label: "Tiangong (Tianhe)" },
];

const PASS_FORECAST_DAYS = 1;
const MIN_VISIBILITY_SECONDS = 90;

const CACHE_TTL_MS = 18 * 60 * 1000;
const passCache = new Map<
  string,
  { storedAt: number; result: CuratedPassesResult }
>();

export type N2yoVisualPass = {
  startUTC: number;
  endUTC: number;
  maxUTC: number;
  duration: number;
  mag: number;
  startAzCompass?: string;
  maxAzCompass?: string;
  maxEl?: number;
};

export type MergedVisualPass = N2yoVisualPass & {
  noradId: number;
  satName: string;
};

export type CuratedPassesResult = {
  passes: MergedVisualPass[];
  /** Satellite requests that threw (network, 504, API error). */
  failedSatelliteCount: number;
};

type N2yoVisualPassesResponse = {
  info?: {
    satname?: string;
    satid?: number;
    passescount?: number;
    error?: string;
  };
  passes?: N2yoVisualPass[];
};

function getApiKey(): string | undefined {
  if (typeof process === "undefined") return undefined;
  const raw = process.env.EXPO_PUBLIC_N2YO_API_KEY;
  if (raw == null || raw === "") return undefined;
  return raw.trim().replace(/^["']|["']$/g, "");
}

function normalizeObserverCoords(latitude: number, longitude: number) {
  return {
    lat: Math.round(latitude * 1000) / 1000,
    lng: Math.round(longitude * 1000) / 1000,
  };
}

/** Align with debounced location; used for cache keys. */
export function locationCacheKey(latitude: number, longitude: number): string {
  const { lat, lng } = normalizeObserverCoords(latitude, longitude);
  return `${lat.toFixed(2)},${lng.toFixed(2)}`;
}

function filterNext24Hours(passes: MergedVisualPass[]): MergedVisualPass[] {
  const now = Date.now();
  const end = now + 24 * 60 * 60 * 1000;
  return passes.filter((p) => {
    const startMs = p.startUTC * 1000;
    return startMs >= now && startMs <= end;
  });
}

function sortAndDedupe(passes: MergedVisualPass[]): MergedVisualPass[] {
  const seen = new Set<string>();
  const out: MergedVisualPass[] = [];
  const sorted = [...passes].sort((a, b) => a.startUTC - b.startUTC);
  for (const p of sorted) {
    const k = `${p.noradId}-${p.startUTC}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(p);
  }
  return out;
}

/**
 * Run async work in chunks of `limit` concurrent tasks (reduces N2YO 504s).
 */
async function runPool<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    await Promise.all(chunk.map((item) => worker(item)));
  }
}

/**
 * @param noradId e.g. 25544 for ISS
 * @param days 1–10
 * @param minVisibilitySeconds minimum pass length to include (e.g. 120)
 */
export async function fetchVisualPasses(
  noradId: number,
  latitude: number,
  longitude: number,
  observerAltMeters = 0,
  days = 5,
  minVisibilitySeconds = 120,
): Promise<{ satName: string; passes: N2yoVisualPass[] }> {
  const apiKey = getApiKey();
  if (apiKey == null || apiKey === "") {
    throw new Error(
      "Missing EXPO_PUBLIC_N2YO_API_KEY. Add it to .env at the project root (next to package.json), then restart with: npx expo start --clear",
    );
  }

  const { lat, lng } = normalizeObserverCoords(latitude, longitude);
  const url = `https://api.n2yo.com/rest/v1/satellite/visualpasses/${noradId}/${lat}/${lng}/${observerAltMeters}/${days}/${minVisibilitySeconds}/?apiKey=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`N2YO error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as N2yoVisualPassesResponse;
  const err = data.info?.error;
  if (err != null && err !== "") {
    throw new Error(err);
  }

  const satName = data.info?.satname ?? `Satellite ${noradId}`;
  const passes = Array.isArray(data.passes) ? data.passes : [];
  return { satName, passes };
}

/**
 * Fetches visual passes for {@link CURATED_SATELLITES} with days=1, 90s min visibility,
 * merges and returns passes starting in the next 24 hours. Cached ~18m per rounded location.
 */
export async function fetchCuratedVisualPasses(
  latitude: number,
  longitude: number,
  options?: { bypassCache?: boolean },
): Promise<CuratedPassesResult> {
  const key = locationCacheKey(latitude, longitude);
  if (!options?.bypassCache) {
    const hit = passCache.get(key);
    if (hit != null && Date.now() - hit.storedAt < CACHE_TTL_MS) {
      return hit.result;
    }
  }

  const merged: MergedVisualPass[] = [];
  let failedSatelliteCount = 0;

  await runPool(CURATED_SATELLITES, 2, async (sat) => {
    try {
      const { satName, passes } = await fetchVisualPasses(
        sat.noradId,
        latitude,
        longitude,
        0,
        PASS_FORECAST_DAYS,
        MIN_VISIBILITY_SECONDS,
      );
      const name = sat.label ?? satName;
      for (const p of passes) {
        merged.push({
          ...p,
          noradId: sat.noradId,
          satName: name,
        });
      }
    } catch {
      failedSatelliteCount += 1;
    }
  });

  const filtered = filterNext24Hours(merged);
  const passes = sortAndDedupe(filtered);

  const result: CuratedPassesResult = { passes, failedSatelliteCount };

  if (passes.length === 0 && failedSatelliteCount >= CURATED_SATELLITES.length) {
    throw new Error(
      "Could not load satellite passes (all requests failed). Try again later.",
    );
  }

  passCache.set(key, { storedAt: Date.now(), result });
  return result;
}

export function formatPassTimeRange(startMs: number, endMs: number): string {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };
  const a = new Date(startMs).toLocaleTimeString([], opts);
  const b = new Date(endMs).toLocaleTimeString([], opts);
  return `${a} – ${b}`;
}

/** N2YO uses 100000 when magnitude is unknown */
export function formatPassMagnitude(mag: number): string | null {
  if (!Number.isFinite(mag) || mag >= 99999) return null;
  return `mag ~${mag.toFixed(1)}`;
}
