import { Cloud } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import CloudItem from "./CloudItem";

const CloudMovement = () => {
  return (
    <View style={styles.container}>
      {/*title and tag*/}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text
          style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "semibold" }}
        >
          Cloud Movement
        </Text>
        <View style={styles.forcastTag}>
          <Cloud style={{ color: "#4D7CFE" }} />
          <Text style={{ color: "#FFFFFF" }}>Clearing</Text>
        </View>
      </View>
      {/*little cloud icons very cute*/}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 16,
        }}
      >
        <CloudItem />
        <CloudItem />
        <CloudItem />
        <CloudItem />
      </View>

      <View style={styles.forecastText}>
        <Text style={{ fontWeight: "500", color: "#FFFFFF" }}>
          Forecast:{" "}
          <Text style={{ fontWeight: "400", color: "#FFFFFF" }}>
            Clouds are moving northeast and clearing. Excelent visibility
            expected within 2 hours.
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    width: "90%",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    fontFamily: "System",
  },
  forcastTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#2A2A2A",
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 100,
  },
  forecastText: {
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    width: "100%",
  },
});

export default CloudMovement;
