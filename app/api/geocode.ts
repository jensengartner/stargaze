/**
 * Open-Meteo Geocoding API (no API key for non-commercial use).
 * US-only filter aligns with NOAA weather.gov coverage.
 */

const GEOCODE_BASE = "https://geocoding-api.open-meteo.com/v1/search";

export type OpenMeteoGeocodePlace = {
  id?: number;
  name?: string;
  latitude?: number;
  longitude?: number;
  country?: string;
  admin1?: string;
};

export type OpenMeteoGeocodeResponse = {
  results?: OpenMeteoGeocodePlace[];
};

export type GeocodePlace = {
  id?: number;
  label: string;
  lat: number;
  lon: number;
};

function buildLabel(place: OpenMeteoGeocodePlace): string {
  const name = place.name ?? "Unknown";
  if (place.admin1 != null && place.admin1 !== "") {
    return `${name}, ${place.admin1}`;
  }
  if (place.country != null && place.country !== "") {
    return `${name}, ${place.country}`;
  }
  return name;
}

function mapToPlace(place: OpenMeteoGeocodePlace): GeocodePlace | null {
  if (
    typeof place.latitude !== "number" ||
    typeof place.longitude !== "number"
  ) {
    return null;
  }
  return {
    id: place.id,
    label: buildLabel(place),
    lat: place.latitude,
    lon: place.longitude,
  };
}

export type SearchLocationsOptions = {
  signal?: AbortSignal;
  count?: number;
};

/**
 * Returns matching US places for the query. Empty list if query is too short.
 */
export async function searchOpenMeteoLocations(
  query: string,
  options?: SearchLocationsOptions,
): Promise<{ places: GeocodePlace[] }> {
  const q = query.trim();
  if (q.length < 2) {
    return { places: [] };
  }

  const count = options?.count ?? 10;
  const params = new URLSearchParams({
    name: q,
    count: String(count),
    language: "en",
    countryCode: "US",
  });

  const response = await fetch(`${GEOCODE_BASE}?${params.toString()}`, {
    signal: options?.signal,
  });

  if (!response.ok) {
    throw new Error(`Geocoding failed (${response.status})`);
  }

  const data = (await response.json()) as OpenMeteoGeocodeResponse;
  const raw = data.results ?? [];
  const places: GeocodePlace[] = [];
  for (const item of raw) {
    const mapped = mapToPlace(item);
    if (mapped != null) {
      places.push(mapped);
    }
  }
  return { places };
}
