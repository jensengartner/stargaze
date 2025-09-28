import { Map, MoonStar } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CloudMovement from "../components/CloudMovement";
import HourlyForecast from "../components/HourlyForecast";
import Location from "../components/Location";
import WeatherDetails from "../components/WeatherDetails";
import WeatherOverview from "../components/WeatherOverview";

const HomeScreen = () => {
  return (
    <ScrollView style={{ backgroundColor: "#121212" }} contentContainerStyle={styles.container}>
      {/*header*/}
      <View style={styles.header}>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <Text style={styles.headerTitle}>Stargaze</Text>
          <Text style={styles.headerSubtitle}>
            Perfect viewing conditions tonight
          </Text>
        </View>
        {/*buttons*/}
        <View style={{ flexDirection: "row", gap: 8, flexShrink: 0 }}>
          <TouchableOpacity style={styles.headerButton}>
            <Map />
            Map
          </TouchableOpacity>
          {/*make icon change based on theme*/}
          <TouchableOpacity style={styles.headerButton}>
            <MoonStar />
            Theme
          </TouchableOpacity>
        </View>
      </View>
      {/*location component*/}
      <Location />
      {/*weather overview component*/}
      <WeatherOverview />
      {/*cloud movement component, will change +1hr, +2hr to times*/}
      <CloudMovement />
      {/*hourly forecast component, will probably remove*/}
      <HourlyForecast />
      {/*weather details component, maybe not necessary*/}
      <WeatherDetails />
      {/*celestial events component*/}
      {/*satellite passes component*/}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#121212",
    color: "#ffffff",
  },
  header: {
    width: "100%",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#A0A0A0",
    marginTop: 4,
    flexWrap: "wrap",
    maxWidth: 200,
    lineHeight: 24,
  },
  headerButton: {
    backgroundColor: "#1E1E1E",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderColor: "#2A2A2A",
    borderWidth: 1,
    fontFamily: "System",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default HomeScreen;
