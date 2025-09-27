import { Moon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

const WeatherOverview = () => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "column", gap: 4 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "bold" }}>
          Clear Sky
        </Text>
        <Text style={{ color: "#A0A0A0" }}>Excellent visibility, 10 miles</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Moon style={{ color: "#4D7CFE" }} size={48} />
        <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "bold" }}>
          58°
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    width: "90%",
    margin: 16,
    padding: 20,
    fontFamily: "System",
  },
});

export default WeatherOverview;
