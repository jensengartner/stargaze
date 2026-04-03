import { Cloud, CloudRain, Thermometer, Wind } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import {
  formatPrecipitationPercent,
  shortForecastToCloudCoverage,
  formatWindDetail,
  type NwsHourlyForecast,
} from "../app/api/WeatherData";

type Props = {
  data: NwsHourlyForecast | null;
  fetchStatus?: string;
  fetchError?: string | null;
};

const WeatherDetails = ({
  data,
  fetchStatus = "idle",
  fetchError = null,
}: Props) => {
  if (fetchError != null && fetchError !== "") {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Weather Details</Text>
        <Text style={styles.errorText}>{fetchError}</Text>
      </View>
    );
  }

  const periods = data?.properties?.periods;
  if (fetchStatus === "loading" && (periods == null || periods.length === 0)) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Weather Details</Text>
        <Text style={styles.muted}>Loading details…</Text>
      </View>
    );
  }

  if (periods == null || periods.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Weather Details</Text>
        <Text style={styles.muted}>No forecast data yet.</Text>
      </View>
    );
  }

  const current = periods[0];
  const temp =
    current.temperature != null && current.temperatureUnit != null
      ? `${current.temperature}°${current.temperatureUnit}`
      : "—";
  const precip = formatPrecipitationPercent(
    current.probabilityOfPrecipitation,
  );
  const wind = formatWindDetail(current.windDirection, current.windSpeed);
  const cloud = shortForecastToCloudCoverage(current.shortForecast);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Weather Details</Text>

      <View style={styles.row}>
        <View style={styles.cell}>
          <Thermometer color="#4D7CFE" size={28} />
          <View style={styles.cellText}>
            <Text style={styles.label}>Temperature</Text>
            <Text style={styles.value}>{temp}</Text>
          </View>
        </View>

        <View style={styles.cell}>
          <CloudRain color="#4D7CFE" size={28} />
          <View style={styles.cellText}>
            <Text style={styles.label}>Precipitation</Text>
            <Text style={styles.value}>{precip}</Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.cell}>
          <Wind color="#4D7CFE" size={28} />
          <View style={styles.cellText}>
            <Text style={styles.label}>Wind</Text>
            <Text style={styles.value}>{wind}</Text>
          </View>
        </View>

        <View style={styles.cell}>
          <Cloud color="#4D7CFE" size={28} />
          <View style={styles.cellText}>
            <Text style={styles.label}>Sky</Text>
            <Text style={styles.value} numberOfLines={2}>
              {cloud}
            </Text>
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
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
    marginBottom: 16,
  },
  cell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  cellText: {
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
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
  muted: {
    color: "#A0A0A0",
    marginTop: 4,
  },
  errorText: {
    color: "#FF6B6B",
    marginTop: 4,
  },
});

export default WeatherDetails;
