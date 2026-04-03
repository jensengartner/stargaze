import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { computeCelestialRows } from "../app/api/CelestialComputation";
import CelestialObjectsItem from "./CelestialObjectsItem";

type Props = {
  latitude: number;
  longitude: number;
};

const CelestialObjects = ({ latitude, longitude }: Props) => {
  const rows = useMemo(
    () => computeCelestialRows(latitude, longitude),
    [latitude, longitude],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Celestial Objects</Text>
      <Text style={styles.hint}>
        Moon and planets visible after dusk for your location (clear sky).
      </Text>
      {rows.length === 0 ? (
        <Text style={styles.empty}>
          Nothing reaches a good altitude in the next night window — try again
          closer to evening or check polar/extreme latitudes.
        </Text>
      ) : (
        <View style={styles.list}>
          {rows.map((item) => (
            <CelestialObjectsItem key={item.id} item={item} />
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
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  hint: {
    color: "#A0A0A0",
    fontSize: 13,
    marginBottom: 12,
  },
  list: {
    flexDirection: "column",
    gap: 12,
  },
  empty: {
    color: "#A0A0A0",
    fontSize: 14,
    lineHeight: 20,
  },
});

export default CelestialObjects;
