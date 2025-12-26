import { Moon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

const WeatherOverview = ({data}) => {

    // Return nothing if data is null (meaning the fetch hasn't completed yet)
  if (!data || !data.properties || !data.properties.periods) {
    return <Text>Waiting for hourly forecast data...</Text>;
  }

  // Get the first period (the current or next hour's forecast)
  const currentPeriod = data.properties.periods[0];

  const { 
    temperature, 
    temperatureUnit, 
    shortForecast, 
    startTime 
  } = currentPeriod;

    // Format the time for readability
  const forecastTime = new Date(startTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
  });

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "column", gap: 4 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "bold" }}>
          {shortForecast}
        </Text>
        <Text style={{ color: "#A0A0A0" }}>Excellent visibility, 10 miles</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Moon style={{ color: "#4D7CFE" }} size={48} />
        <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "bold" }}>
          {temperature}°{temperatureUnit}
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
