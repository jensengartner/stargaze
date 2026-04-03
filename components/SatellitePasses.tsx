import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  CURATED_SATELLITES,
  fetchCuratedVisualPasses,
  formatPassMagnitude,
  formatPassTimeRange,
} from "../app/api/SatelliteData";
import SatellitePassesItem, {
  type SatellitePassRow,
} from "./SatellitePassesItem";

const MAX_PASSES_SHOWN = 14;
const LOCATION_DEBOUNCE_MS = 500;

type Props = {
  latitude: number;
  longitude: number;
};

const SatellitePasses = ({ latitude, longitude }: Props) => {
  const [rows, setRows] = useState<SatellitePassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partialWarning, setPartialWarning] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const skipDebounceOnce = useRef(true);
  const [debouncedCoords, setDebouncedCoords] = useState({
    lat: latitude,
    lon: longitude,
  });

  useEffect(() => {
    if (skipDebounceOnce.current) {
      skipDebounceOnce.current = false;
      return;
    }
    const t = setTimeout(() => {
      setDebouncedCoords({ lat: latitude, lon: longitude });
    }, LOCATION_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [latitude, longitude]);

  const load = useCallback(async () => {
    const id = ++requestIdRef.current;
    const stale = () => id !== requestIdRef.current;
    setLoading(true);
    setError(null);
    setPartialWarning(null);
    try {
      const { passes, failedSatelliteCount } = await fetchCuratedVisualPasses(
        debouncedCoords.lat,
        debouncedCoords.lon,
      );
      if (stale()) return;

      if (
        failedSatelliteCount > 0 &&
        failedSatelliteCount < CURATED_SATELLITES.length
      ) {
        if (passes.length > 0) {
          setPartialWarning(
            `Some satellites could not be loaded (${failedSatelliteCount} of ${CURATED_SATELLITES.length}).`,
          );
        } else {
          setPartialWarning(
            `No passes in the next 24 hours; ${failedSatelliteCount} of ${CURATED_SATELLITES.length} sources failed to load.`,
          );
        }
      }

      const mapped: SatellitePassRow[] = passes
        .slice(0, MAX_PASSES_SHOWN)
        .map((p) => {
          const startMs = p.startUTC * 1000;
          const endMs = p.endUTC * 1000;
          const magStr = formatPassMagnitude(p.mag);
          const el = p.maxEl ?? 0;
          const detailParts = [
            p.maxAzCompass != null ? `Peak ${p.maxAzCompass}` : null,
            p.maxEl != null ? `${Math.round(el)}° max` : null,
            magStr,
          ].filter(Boolean);
          return {
            id: `${p.noradId}-${p.startUTC}`,
            name: p.satName,
            timeRange: formatPassTimeRange(startMs, endMs),
            detail: detailParts.join(" · "),
            visible: el >= 20,
          };
        });
      setRows(mapped);
    } catch (e: unknown) {
      if (stale()) return;
      const msg = e instanceof Error ? e.message : "Could not load passes";
      setError(msg);
      setRows([]);
    } finally {
      if (!stale()) setLoading(false);
    }
  }, [debouncedCoords.lat, debouncedCoords.lon]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Satellite Passes</Text>
      <Text style={styles.credit}>
        Next 24 hours · {CURATED_SATELLITES.length} satellites · Predictions
        from N2YO. Add EXPO_PUBLIC_N2YO_API_KEY in project-root .env if missing.
      </Text>
      {partialWarning != null ? (
        <Text style={styles.warning}>{partialWarning}</Text>
      ) : null}
      {loading ? (
        <Text style={styles.muted}>Loading passes…</Text>
      ) : error != null ? (
        <Text style={styles.error}>{error}</Text>
      ) : rows.length === 0 ? (
        <Text style={styles.muted}>
          No visual passes in the next 24 hours for these satellites at this
          location — try again later or pick another evening.
        </Text>
      ) : (
        <View style={styles.list}>
          {rows.map((row) => (
            <SatellitePassesItem key={row.id} row={row} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#1E1E1E",
    width: "90%",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    fontFamily: "System",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  credit: {
    color: "#707070",
    fontSize: 11,
    marginBottom: 12,
  },
  warning: {
    color: "#C9A227",
    fontSize: 12,
    marginBottom: 10,
  },
  list: {
    flexDirection: "column",
    gap: 12,
  },
  muted: {
    color: "#A0A0A0",
    fontSize: 14,
  },
  error: {
    color: "#FF6B6B",
    fontSize: 14,
  },
});

export default SatellitePasses;
