import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
    fetchVisualPasses,
    formatPassMagnitude,
    formatPassTimeRange,
    NORAD_ISS,
} from "../app/api/SatelliteData";
import SatellitePassesItem, {
    type SatellitePassRow,
} from "./SatellitePassesItem";

const MAX_PASSES_SHOWN = 6;
/** N2YO visual pass window (fewer days = lighter request, fewer 504 timeouts). */
const PASS_FORECAST_DAYS = 3;

type Props = {
  latitude: number;
  longitude: number;
};

const SatellitePasses = ({ latitude, longitude }: Props) => {
  const [rows, setRows] = useState<SatellitePassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const id = ++requestIdRef.current;
    const stale = () => id !== requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const { satName, passes } = await fetchVisualPasses(
        NORAD_ISS,
        latitude,
        longitude,
        0,
        PASS_FORECAST_DAYS,
        90,
      );
      if (stale()) return;
      const mapped: SatellitePassRow[] = passes
        .slice(0, MAX_PASSES_SHOWN)
        .map((p, i) => {
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
            id: `${p.startUTC}-${i}`,
            name: satName,
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
  }, [latitude, longitude]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Satellite Passes</Text>
      <Text style={styles.credit}>
        Pass predictions from N2YO (ISS). Add EXPO_PUBLIC_N2YO_API_KEY in .env.
      </Text>
      {loading ? (
        <Text style={styles.muted}>Loading passes…</Text>
      ) : error != null ? (
        <Text style={styles.error}>{error}</Text>
      ) : rows.length === 0 ? (
        <Text style={styles.muted}>
          No ISS passes in the next {PASS_FORECAST_DAYS} days with the current
          filters — try again later or lower min. visibility in code.
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
