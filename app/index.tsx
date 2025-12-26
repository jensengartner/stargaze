import { Map, MoonStar } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CelestialObjects from "../components/CelestialObjects";
import CloudMovement from "../components/CloudMovement";
import HourlyForecast from "../components/HourlyForecast";
import LightPolutionMapModal from "../components/LightPolutionMapModal";
import Location from "../components/Location";
import SatellitePasses from "../components/SatellitePasses";
import WeatherDetails from "../components/WeatherDetails";
import WeatherOverview from "../components/WeatherOverview";

import DataFetcher from "./api/DataFetcher";

const selectedLocation = {
  lat: 39.7456, // Example Latitude (e.g., Kansas/Oklahoma border)
  lon: -97.0892,
};
const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
// 1. Location is hardcoded. Using useState only for consistency if you decide to change it later.
  const [location] = useState(selectedLocation)

  // 2. State to hold the fetched data
  const [weatherData, setWeatherData] = useState(null);
  
  // 3. Callback function to receive data from the DataFetcher child
  const handleDataFetched = useCallback((data) => {
    setWeatherData(data);
    console.log("Parent: Weather data received and set.");
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: "#121212" }}
      contentContainerStyle={styles.container}
    >
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
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setModalVisible(true)}
          >
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

      {/* The API Component: Triggers the fetch upon mount. 
          It sends the result back via onDataFetched. */}
      <DataFetcher
        latitude={location.lat}
        longitude={location.lon}
        onDataFetched={handleDataFetched}
        // Removed onError since the minimized DataFetcher handles errors internally
      />


      {/*location component*/}
      <Location />
      {/*weather overview component*/}
      <WeatherOverview data={weatherData}/>
      {/*cloud movement component, will change +1hr, +2hr to times*/}
      <CloudMovement />
      {/*hourly forecast component, will probably remove*/}
      <HourlyForecast />
      {/*weather details component, maybe not necessary*/}
      <WeatherDetails />
      {/*celestial events component*/}
      <CelestialObjects />
      {/*satellite passes component*/}
      <SatellitePasses />

      {/*map modal*/}
      <LightPolutionMapModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
