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
import LocationSearchModal from "../components/LocationSearchModal";
import SatellitePasses from "../components/SatellitePasses";
import WeatherDetails from "../components/WeatherDetails";
import WeatherOverview from "../components/WeatherOverview";
import DataFetcher from "./api/DataFetcher";
import {
  cloudCoverPercentForNwsPeriod,
  stargazingSubtitleFromCloudCover,
  type NwsHourlyForecast,
  type OpenMeteoHourlyCloud,
} from "./api/WeatherData";

const HomeScreen = () => {
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedLocation, setSelectedLocation] = useState({
    lat: 34.0522,
    lon: -118.2437,
    label: "Los Angeles, CA",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const [weatherData, setWeatherData] = useState<NwsHourlyForecast | null>(
    null,
  );
  const [openMeteoCloud, setOpenMeteoCloud] =
    useState<OpenMeteoHourlyCloud | null>(null);

  const handleSelectLocation = useCallback(
    (loc: { label: string; lat: number; lon: number }) => {
      setSelectedLocation({
        label: loc.label,
        lat: loc.lat,
        lon: loc.lon,
      });
    },
    [],
  );

  const handleChangeLocation = () => {
    setLocationModalVisible(true);
  };

  const periods = weatherData?.properties?.periods;
  let headerStargazingSubtitle: string;
  if (fetchError != null && fetchError !== "") {
    headerStargazingSubtitle = "Forecast unavailable";
  } else if (fetchStatus === "loading" && !periods?.length) {
    headerStargazingSubtitle = "Loading weather…";
  } else if (!periods?.length) {
    headerStargazingSubtitle = "Waiting for hourly forecast data…";
  } else {
    headerStargazingSubtitle = stargazingSubtitleFromCloudCover(
      cloudCoverPercentForNwsPeriod(openMeteoCloud, periods[0].startTime),
    );
  }

  return (
    <>
      <ScrollView
        style={{ backgroundColor: "#121212" }}
        contentContainerStyle={styles.container}
      >
        {/*header*/}
        <View style={styles.header}>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text style={styles.headerTitle}>Stargaze</Text>
            <Text style={styles.headerSubtitle}>
              {headerStargazingSubtitle}
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
          latitude={selectedLocation.lat}
          longitude={selectedLocation.lon}
          onFetchStart={() => {
            setFetchStatus("loading");
            setFetchError(null);
            setOpenMeteoCloud(null);
          }}
          onFetchError={(message) => {
            setFetchStatus("error");
            setFetchError(message);
          }}
          onDataFetched={(data: NwsHourlyForecast) => {
            setFetchStatus("success");
            setFetchError(null);
            setWeatherData(data);
          }}
          onCloudMeteoFetched={(cloud) => {
            setOpenMeteoCloud(cloud);
          }}
        />

        {/*location component*/}
        <Location
          label={selectedLocation.label}
          onPressChangeLocation={handleChangeLocation}
        />
        {/*weather overview component*/}
        <WeatherOverview
          data={weatherData}
          openMeteoCloud={openMeteoCloud}
          fetchStatus={fetchStatus}
          fetchError={fetchError}
        />
        {/*cloud movement component, will change +1hr, +2hr to times*/}
        <CloudMovement
          data={weatherData}
          openMeteoCloud={openMeteoCloud}
          fetchStatus={fetchStatus}
          fetchError={fetchError}
        />
        {/*hourly forecast component, will probably remove*/}
        <HourlyForecast
          data={weatherData}
          fetchStatus={fetchStatus}
          fetchError={fetchError}
        />
        <WeatherDetails
          data={weatherData}
          fetchStatus={fetchStatus}
          fetchError={fetchError}
        />
        <CelestialObjects
          latitude={selectedLocation.lat}
          longitude={selectedLocation.lon}
        />
        <SatellitePasses
          latitude={selectedLocation.lat}
          longitude={selectedLocation.lon}
        />
      </ScrollView>

      <LightPolutionMapModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <LocationSearchModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        onSelectLocation={handleSelectLocation}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
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
