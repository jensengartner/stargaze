/**
 * N2YO REST API — visual satellite passes (free tier; requires API key).
 * Set EXPO_PUBLIC_N2YO_API_KEY in .env (see https://www.n2yo.com/api/).
 */

export const NORAD_ISS = 25544;

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
  if (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_N2YO_API_KEY) {
    return process.env.EXPO_PUBLIC_N2YO_API_KEY;
  }
  return undefined;
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
      "Missing EXPO_PUBLIC_N2YO_API_KEY. Add it to .env for satellite passes.",
    );
  }

  const lat = Math.round(latitude * 1000) / 1000;
  const lng = Math.round(longitude * 1000) / 1000;
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
