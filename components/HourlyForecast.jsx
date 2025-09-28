import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ForecastItem from "./ForecastItem";

const HourlyForecast = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "600" }}>
          Hourly Forecast
        </Text>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          {/*NOTE: this will have states for can go and cant go*/}
          <TouchableOpacity style={styles.scrollButton}>
            <ChevronLeft />
          </TouchableOpacity>
          <TouchableOpacity style={styles.scrollButton}>
            <ChevronRight />
          </TouchableOpacity>
        </View>
      </View>
      {/*forecast items*/}
      <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 16 }}>
      <ForecastItem />
      <ForecastItem />
      <ForecastItem /> 
        <ForecastItem />
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
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    width: "90%",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    fontFamily: "System",
  },
  scrollButton: {
    backgroundColor: "#2A2A2A",
    padding: 6,
    borderRadius: 100,
  },
});

export default HourlyForecast;
