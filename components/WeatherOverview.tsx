import { Moon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import {
  cloudCoverPercentForNwsPeriod,
  stargazingSubtitleFromCloudCover,
  type NwsHourlyForecast,
  type OpenMeteoHourlyCloud,
} from "../app/api/WeatherData";

type Props = {
  data: unknown;
  openMeteoCloud?: OpenMeteoHourlyCloud | null;
  fetchStatus?: string;
  fetchError?: string | null;
};

const WeatherOverview = ({
  data,
  openMeteoCloud = null,
  fetchStatus = "idle",
  fetchError = null,
}: Props) => {
  if (fetchError != null && fetchError !== "") {
    return (
      <Text style={{ color: "#FF6B6B", width: "90%", margin: 16 }}>
        {fetchError}
      </Text>
    );
  }

  const payload = data as NwsHourlyForecast | null | undefined;

  if (fetchStatus === "loading" && !payload?.properties?.periods?.length) {
    return (
      <Text style={{ color: "#A0A0A0", width: "90%", margin: 16 }}>
        Loading weather…
      </Text>
    );
  }

  if (!payload?.properties?.periods?.length) {
    return (
      <Text style={{ color: "#A0A0A0", width: "90%", margin: 16 }}>
        Waiting for hourly forecast data…
      </Text>
    );
  }

  const currentPeriod = payload.properties.periods[0];
  const { temperature, temperatureUnit, shortForecast, startTime } =
    currentPeriod;

  const cloudPct = cloudCoverPercentForNwsPeriod(openMeteoCloud, startTime);
  const stargazingLine = stargazingSubtitleFromCloudCover(cloudPct);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "column", gap: 4 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "bold" }}>
          {shortForecast}
        </Text>
        <Text style={{ color: "#A0A0A0" }}>{stargazingLine}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Moon color="#4D7CFE" size={48} />
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
