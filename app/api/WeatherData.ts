/**
 * NOAA api.weather.gov — types and fetch for gridpoint hourly forecast.
 */

export type NwsQuantitativeValue = {
  value?: number | null;
  unitCode?: string;
};

/** One hour (or sub-period) entry from /gridpoints/.../forecast/hourly */
export type NwsHourlyPeriod = {
  temperature?: number;
  temperatureUnit?: string;
  shortForecast?: string;
  startTime?: string;
  endTime?: string;
  windSpeed?: string;
  windDirection?: string;
  probabilityOfPrecipitation?: NwsQuantitativeValue | null;
};

export type NwsHourlyForecast = {
  properties?: {
    periods?: NwsHourlyPeriod[];
  };
};

/** “Now” through eight hours later → nine hourly periods */
export const HOURLY_FORECAST_WINDOW_HOURS = 8;
export const HOURLY_FORECAST_SLOT_COUNT = HOURLY_FORECAST_WINDOW_HOURS + 1;

export function sliceHourlyWindow(
  periods: NwsHourlyPeriod[] | undefined,
): NwsHourlyPeriod[] {
  if (periods == null || periods.length === 0) return [];
  return periods.slice(0, HOURLY_FORECAST_SLOT_COUNT);
}

export function formatHourlyCardTimeLabel(
  period: NwsHourlyPeriod,
  index: number,
): string {
  if (index === 0) return "Now";
  if (period.startTime == null || period.startTime === "") return "—";
  return new Date(period.startTime).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatPrecipitationPercent(
  pop: NwsQuantitativeValue | null | undefined,
): string {
  const v = pop?.value;
  if (v == null || Number.isNaN(Number(v))) return "—";
  return `${Math.round(Number(v))}%`;
}

/** Open-Meteo hourly cloud cover, anchored from the current hour via forecast_hours. */

export type OpenMeteoHourlyCloud = {
  hourly?: {
    time: string[];
    cloud_cover: (number | null)[];
  };
};

export async function fetchOpenMeteoHourlyCloudCover(
  lat: number,
  lon: number,
  forecastHours = 12,
): Promise<OpenMeteoHourlyCloud> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: "cloud_cover",
    forecast_hours: String(forecastHours),
    timezone: "auto",
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch hourly cloud cover: ${res.statusText}`);
  }
  return (await res.json()) as OpenMeteoHourlyCloud;
}

/** Map an NWS hourly period start time to the nearest Open-Meteo cloud_cover (%). */
export function cloudCoverPercentForNwsPeriod(
  openMeteo: OpenMeteoHourlyCloud | null | undefined,
  nwsStartIso: string | undefined,
): number | null {
  const times = openMeteo?.hourly?.time;
  const covers = openMeteo?.hourly?.cloud_cover;
  if (
    nwsStartIso == null ||
    nwsStartIso === "" ||
    times == null ||
    covers == null ||
    times.length === 0
  ) {
    return null;
  }

  const target = new Date(nwsStartIso).getTime();
  if (Number.isNaN(target)) return null;

  let bestIdx = -1;
  let bestDiff = Infinity;
  for (let i = 0; i < times.length; i++) {
    const t = new Date(times[i]).getTime();
    if (Number.isNaN(t)) continue;
    const diff = Math.abs(t - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }

  if (bestIdx < 0 || bestDiff > 90 * 60 * 1000) return null;
  const v = covers[bestIdx];
  if (v == null || Number.isNaN(Number(v))) return null;
  return Math.round(Number(v));
}

export function formatCloudCoverPercent(pct: number | null): string {
  if (pct == null) return "—";
  return `${pct}%`;
}

/** One-line stargazing hint from Open-Meteo total cloud cover (%). */
export function stargazingSubtitleFromCloudCover(
  cloudCoverPercent: number | null,
): string {
  if (cloudCoverPercent == null) {
    return "Cloud outlook unavailable";
  }
  const p = cloudCoverPercent;
  if (p <= 25) {
    return "Great for stargazing";
  }
  if (p <= 50) {
    return "Mixed sky — some clear windows likely";
  }
  if (p <= 75) {
    return "Often cloudy — stargazing may be limited";
  }
  return "Mostly overcast — poor for stars";
}

/** Readable cloud/sky line from NWS shortForecast (no numeric cover in API). */
export function shortForecastToCloudCoverage(
  shortForecast: string | undefined,
): string {
  if (shortForecast == null || shortForecast === "") return "—";
  const s = shortForecast.toLowerCase();
  if (/\brain|shower|storm|drizzle|snow|precip|thunder|t-storm/.test(s)) {
    return shortForecast;
  }
  if (/\bclear\b|\bsunny\b|\bfair\b/.test(s)) return "Clear";
  if (/\bpartly\b/.test(s)) return "Partly cloudy";
  if (/\bmostly cloudy\b/.test(s)) return "Mostly cloudy";
  if (/\bcloudy\b|\bovercast\b/.test(s)) return "Cloudy";
  return shortForecast;
}

export function formatWindDetail(
  windDirection: string | undefined,
  windSpeed: string | undefined,
): string {
  const dir = windDirection?.trim() ?? "";
  const spd = windSpeed?.trim() ?? "";
  if (dir === "" && spd === "") return "—";
  if (dir === "") return spd;
  if (spd === "") return dir;
  return `${dir} ${spd}`;
}

/** First index is “now”; next four slots are the upcoming hours shown in Cloud Movement. */
export const CLOUD_MOVEMENT_SLOT_COUNT = 5;

export function sliceCloudMovementWindow(
  periods: NwsHourlyPeriod[] | undefined,
): NwsHourlyPeriod[] {
  if (periods == null || periods.length === 0) return [];
  return periods.slice(0, CLOUD_MOVEMENT_SLOT_COUNT);
}

/** Hourly periods for the next four hours after the current slot (no “Now” column). */
export function sliceCloudMovementDisplayPeriods(
  windowPeriods: NwsHourlyPeriod[],
): NwsHourlyPeriod[] {
  return windowPeriods.slice(1, CLOUD_MOVEMENT_SLOT_COUNT);
}

/** Higher = cloudier / worse for clearing. */
function skyHeaviness(shortForecast: string | undefined): number {
  if (shortForecast == null || shortForecast === "") return 1;
  const s = shortForecast.toLowerCase();
  if (/\brain|shower|storm|drizzle|snow|precip|thunder|t-storm/.test(s)) {
    return 4;
  }
  if (/\bovercast\b|\bcloudy\b/.test(s)) return 3;
  if (/\bmostly cloudy\b/.test(s)) return 2.5;
  if (/\bpartly\b/.test(s)) return 1.5;
  if (/\bclear\b|\bsunny\b|\bfair\b/.test(s)) return 0;
  return 1;
}

/**
 * Pill label from the first few hourly periods (heuristic).
 */
export function inferSkyTrend(periods: NwsHourlyPeriod[]): string {
  const slice = periods.slice(0, 3).filter(Boolean);
  if (slice.length === 0) return "Mixed";

  const h0 = skyHeaviness(slice[0]?.shortForecast);
  const hLast = skyHeaviness(slice[slice.length - 1]?.shortForecast);

  const pops = slice
    .map((p) => p.probabilityOfPrecipitation?.value)
    .filter((v): v is number => v != null && !Number.isNaN(Number(v)))
    .map((v) => Number(v));
  const pop0 = pops[0] ?? 0;
  const popEnd = pops[pops.length - 1] ?? pop0;

  if (hLast < h0 - 0.4 && popEnd <= pop0) return "Clearing";
  if (hLast > h0 + 0.4 || popEnd > pop0 + 25) return "Building";
  if (Math.abs(hLast - h0) < 0.35 && Math.abs(popEnd - pop0) < 20) {
    return "Steady";
  }
  return "Mixed";
}

/** Meteorological compass → degrees clockwise from north (wind *from*). */
const WIND_FROM_DEGREES: Record<string, number> = {
  N: 0,
  NNE: 22.5,
  NE: 45,
  ENE: 67.5,
  E: 90,
  ESE: 112.5,
  SE: 135,
  SSE: 157.5,
  S: 180,
  SSW: 202.5,
  SW: 225,
  WSW: 247.5,
  W: 270,
  WNW: 292.5,
  NW: 315,
  NNW: 337.5,
};

/** 16-point abbreviations (N, SE, …) for downwind — where low clouds tend to drift. */
const DOWNWIND_COMPASS_ABBREV = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
] as const;

/**
 * Downwind compass abbreviation from NWS wind **from** direction (same letters as NWS uses).
 */
export function windDirectionToDownwindLabel(
  windDirection: string | undefined,
): string {
  if (windDirection == null) return "—";
  const key = windDirection.trim().toUpperCase();
  if (key === "" || key === "VAR") return "Var";
  const fromDeg = WIND_FROM_DEGREES[key];
  if (fromDeg === undefined) return "—";
  const downwindDeg = (fromDeg + 180) % 360;
  const idx = Math.round(downwindDeg / 22.5) % 16;
  return DOWNWIND_COMPASS_ABBREV[idx] ?? "—";
}

export function buildCloudMovementSummary(
  periods: NwsHourlyPeriod[],
  trend: string,
): string {
  if (periods.length === 0) return "";
  const now = periods[0];
  const wind = formatWindDetail(now.windDirection, now.windSpeed);
  const next = periods[1];
  const nextSky = next?.shortForecast?.trim() ?? "";

  const parts = [
    `Surface wind (from NWS): ${wind}.`,
    `Next few hours look ${trend.toLowerCase()} for cloud cover.`,
  ];
  if (nextSky !== "") {
    parts.push(`Next hour’s forecast: ${nextSky}.`);
  }
  return parts.join(" ");
}

/**
 * @throws Error with a short message on network or API shape failure
 */
export async function fetchHourlyForecast(
  lat: number,
  lon: number,
): Promise<NwsHourlyForecast> {
  const pointsUrl = `https://api.weather.gov/points/${lat},${lon}`;
  let response = await fetch(pointsUrl);

  if (!response.ok) {
    throw new Error(`Error fetching weather data: ${response.statusText}`);
  }

  const gridData: { properties?: { forecastHourly?: string } } =
    await response.json();
  const hourlyForecastUrl = gridData.properties?.forecastHourly;

  if (hourlyForecastUrl == null || hourlyForecastUrl === "") {
    throw new Error(
      `Could not find the 'forecastHourly' URL in the initial response.`,
    );
  }

  response = await fetch(hourlyForecastUrl);

  if (!response.ok) {
    throw new Error(
      `Error fetching hourly forecast data: ${response.statusText}`,
    );
  }

  return (await response.json()) as NwsHourlyForecast;
}
