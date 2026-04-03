import { Star } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import type { CelestialRow } from "../app/api/CelestialComputation";

type Props = {
  item: CelestialRow;
};

const CelestialObjectsItem = ({ item }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Star color="#4D7CFE" size={22} />
        <View style={styles.textCol}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          <Text style={styles.timeHint}>Best around {item.bestTimeLabel}</Text>
        </View>
      </View>
      <Text style={styles.compass}>{item.compass}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "System",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  subtitle: {
    color: "#A0A0A0",
    fontSize: 14,
    marginTop: 6,
  },
  timeHint: {
    color: "#707070",
    fontSize: 12,
    marginTop: 4,
  },
  compass: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default CelestialObjectsItem;
