import { MapPin } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Location = ({ label, onPressChangeLocation }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <MapPin style={{ color: "#4D7CFE" }} />
        <Text style={{ color: "#FFFFFF", fontSize: 16 }}>{label}</Text>
      </View>
      <TouchableOpacity onPress={onPressChangeLocation}>
        <Text style={{ color: "#A0A0A0" }}>Change Location</Text>
      </TouchableOpacity>
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
    fontFamily: "System",
  },
});

export default Location;
