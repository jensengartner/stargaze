/**
 * Local ephemeris for Moon and planets using astronomy-engine (MIT, no API).
 */

import {
  Body,
  Equator,
  Horizon,
  Illumination,
  Observer,
  SearchRiseSet,
} from "astronomy-engine";

export type CelestialRow = {
  id: string;
  name: string;
  subtitle: string;
  compass: string;
  peakAltitudeDeg: number;
  bestTimeLabel: string;
};

const MIN_SUN_ALT_DARK = -6;
const MIN_BODY_ALT = 12;
const SAMPLE_MS = 15 * 60 * 1000;

const PLANET_BLURBS: Partial<Record<Body, string>> = {
  [Body.Mercury]: "Inner planet; low on the horizon when visible",
  [Body.Venus]: "Often the brightest “star” after the Moon",
  [Body.Mars]: "Distinctive orange tint",
  [Body.Jupiter]: "Bright; moons visible in binoculars",
  [Body.Saturn]: "Best with a small telescope for rings",
  [Body.Uranus]: "Very faint; binoculars or telescope",
  [Body.Neptune]: "Telescope only under dark skies",
  [Body.Pluto]: "Telescope only",
};

const TARGET_BODIES: Body[] = [
  Body.Moon,
  Body.Mercury,
  Body.Venus,
  Body.Mars,
  Body.Jupiter,
  Body.Saturn,
  Body.Uranus,
  Body.Neptune,
  Body.Pluto,
];

function sunHorizontal(
  date: Date,
  observer: Observer,
): { altitude: number; azimuth: number } {
  const eq = Equator(Body.Sun, date, observer, true, true);
  const hor = Horizon(date, observer, eq.ra, eq.dec, "normal");
  return { altitude: hor.altitude, azimuth: hor.azimuth };
}

function bodyHorizontal(
  body: Body,
  date: Date,
  observer: Observer,
): { altitude: number; azimuth: number } {
  const eq = Equator(body, date, observer, true, true);
  const hor = Horizon(date, observer, eq.ra, eq.dec, "normal");
  return { altitude: hor.altitude, azimuth: hor.azimuth };
}

/** 0–360° azimuth → 8-point compass */
function azimuthToCompass(azimuthDeg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const i = Math.floor(((azimuthDeg + 22.5) % 360) / 45) % 8;
  return dirs[i] ?? "N";
}

function moonSubtitle(when: Date): string {
  const ill = Illumination(Body.Moon, when);
  const pct = Math.round(ill.phase_fraction * 100);
  if (pct < 5 || pct > 95) return "Slim crescent — darker skies help";
  if (pct >= 45 && pct <= 55) return "Near full — bright for stargazing";
  return `${pct}% illuminated`;
}

function planetSubtitle(body: Body, when: Date): string {
  if (body === Body.Moon) return moonSubtitle(when);
  const blur = PLANET_BLURBS[body];
  if (blur != null) return blur;
  return "Solar system object";
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function nightWindow(observer: Observer, now: Date): { start: Date; end: Date } {
  const { altitude: sunAlt } = sunHorizontal(now, observer);

  if (sunAlt < 0) {
    const rise = SearchRiseSet(Body.Sun, observer, +1, now, 2);
    const end = rise?.date ?? new Date(now.getTime() + 12 * 3600 * 1000);
    return { start: now, end: end };
  }

  const sunset = SearchRiseSet(Body.Sun, observer, -1, now, 2);
  if (sunset == null) {
    return {
      start: now,
      end: new Date(now.getTime() + 12 * 3600 * 1000),
    };
  }
  const sunrise = SearchRiseSet(Body.Sun, observer, +1, sunset.date, 2);
  const end =
    sunrise?.date ??
    new Date(sunset.date.getTime() + 12 * 3600 * 1000);
  return { start: sunset.date, end };
}

/**
 * Objects that reach ≥12° altitude while the Sun is ≥6° below the horizon,
 * during the upcoming night (from next sunset if daytime, else until sunrise).
 */
export function computeCelestialRows(
  latitude: number,
  longitude: number,
  now = new Date(),
): CelestialRow[] {
  const observer = new Observer(latitude, longitude, 0);
  const { start, end } = nightWindow(observer, now);
  if (end.getTime() <= start.getTime()) return [];

  const rows: CelestialRow[] = [];

  for (const body of TARGET_BODIES) {
    let bestAlt = -90;
    let bestAz = 0;
    let bestTime = start;

    for (let t = start.getTime(); t <= end.getTime(); t += SAMPLE_MS) {
      const d = new Date(t);
      const sun = sunHorizontal(d, observer);
      if (sun.altitude > MIN_SUN_ALT_DARK) continue;

      const { altitude, azimuth } = bodyHorizontal(body, d, observer);
      if (altitude > bestAlt) {
        bestAlt = altitude;
        bestAz = azimuth;
        bestTime = d;
      }
    }

    if (bestAlt < MIN_BODY_ALT) continue;

    const name =
      body === Body.Moon ? "Moon" : (body as string);
    rows.push({
      id: name,
      name,
      subtitle: planetSubtitle(body, bestTime),
      compass: `${azimuthToCompass(bestAz)} ${Math.round(bestAlt)}°`,
      peakAltitudeDeg: bestAlt,
      bestTimeLabel: formatTime(bestTime),
    });
  }

  rows.sort((a, b) => b.peakAltitudeDeg - a.peakAltitudeDeg);
  return rows;
}
