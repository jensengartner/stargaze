import { Clock, Satellite } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

const SatellitePassesItem = () => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Satellite style={{ color: "#4D7CFE" }}></Satellite>
        <View>
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "500" }}>
            ISS
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Clock style={{ color: "#A0A0A0", marginTop: 6 }} size={14} />
            <Text style={{ color: "#A0A0A0", fontSize: 14, marginTop: 6 }}>
              10:42 PM - 10:50 PM
            </Text>
          </View>
        </View>
      </View>
      {/*will have options based on visibility*/}
      {/* <Text style={{ color: "#A0A0A0", marginRight: 12 }}>Dim</Text> */}
      <Text style={styles.visibleTag}>Visible</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    color: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "System",
  },
  visibleTag: {
    backgroundColor: "#4D7CFE",
    padding: 6,
    borderRadius: 4,
  },
});

export default SatellitePassesItem;
