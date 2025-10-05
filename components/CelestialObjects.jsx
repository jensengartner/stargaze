import { StyleSheet, Text, View } from "react-native";
import CelestialObjectsItem from "./CelestialObjectsItem";

const CelestialObjects = () => {
  return (
    <View style={styles.container}>
      <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
        Celestial Objects
      </Text>
      <View style={{flexDirection: "column", gap: 12}}>
      <CelestialObjectsItem />
      <CelestialObjectsItem />
      <CelestialObjectsItem />
      </View>
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
});

export default CelestialObjects;
