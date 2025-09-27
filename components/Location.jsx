import { MapPin } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

const Location = () => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <MapPin style={{ color: "#4D7CFE" }} />
        <Text style={{ color: "#FFFFFF", fontSize: 16 }}>Los Angeles, CA</Text>
      </View>
      <Text style={{ color: "#A0A0A0" }}>Change Location</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E1E1E",
    borderColor: "#2A2A2A",
    borderWidth: 1,
    borderRadius: 8,
    width: "90%",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    fontFamily: "System",
  },
});

export default Location;
