import { Star } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

const CelestialObjectsItem = () => {
  return (
    <View style={styles.container}>
        <View style={{flexDirection: "row", alignItems: "center", gap: 12}}>
      <Star style={{ color: "#4D7CFE" }}></Star>
      <View>
        <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "500" }}>
          Sirius
        </Text>
        <Text style={{color: "#A0A0A0",
    fontSize: 14,
    marginTop: 6}}>Brightest star in night sky</Text>
    </View>
      </View>
      <Text style={{ color: "#FFFFFF", fontSize: 18}}>SE 45°</Text>
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
});

export default CelestialObjectsItem;
