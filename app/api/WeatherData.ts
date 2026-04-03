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

/**
 * Resolves gridpoint from lat/lon, then fetches hourly forecast JSON.
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
