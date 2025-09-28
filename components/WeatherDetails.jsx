import { Cloud, CloudRain, Thermometer, Wind } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

const WeatherDetails = () => {
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: "#ffffff",
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 8,
        }}
      >
        Weather Details
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            flex: 1,
          }}
        >
          <Thermometer style={{ color: "#4D7CFE" }} size={28} />
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text style={styles.label}>Temperature</Text>
            <Text style={styles.value}>58°F</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            flex: 1,
          }}
        >
          <CloudRain style={{ color: "#4D7CFE" }} size={28} />
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text style={styles.label}>Precipitation</Text>
            <Text style={styles.value}>0%</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            flex: 1,
          }}
        >
          <Wind color="#4D7CFE" size={28} />
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text style={styles.label}>Wind</Text>
            <Text style={styles.value}>3 mph</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            flex: 1,
          }}
        >
          <Cloud color="#4D7CFE" size={28} />
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text style={styles.label}>Cloud Coverage</Text>
            <Text style={styles.value}>15%</Text>
          </View>
        </View>
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
  label: {
    color: "#A0A0A0",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 2,
  },
  value: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});

export default WeatherDetails;
