import { Cloud } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import {
  buildCloudMovementSummary,
  formatHourlyCardTimeLabel,
  inferSkyTrend,
  shortForecastToCloudCoverage,
  sliceCloudMovementDisplayPeriods,
  sliceCloudMovementWindow,
  windDirectionToDownwindLabel,
  type NwsHourlyForecast,
} from "../app/api/WeatherData";
import CloudItem from "./CloudItem";

type Props = {
  data: NwsHourlyForecast | null;
  fetchStatus?: string;
  fetchError?: string | null;
};

const CloudMovement = ({
  data,
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

  const payload = data;
  if (
    fetchStatus === "loading" &&
    (payload?.properties?.periods?.length ?? 0) === 0
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cloud Movement</Text>
        <Text style={styles.muted}>Loading cloud outlook…</Text>
      </View>
    );
  }

  const windowPeriods = sliceCloudMovementWindow(payload?.properties?.periods);
  if (windowPeriods.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cloud Movement</Text>
        <Text style={styles.muted}>Waiting for hourly forecast data…</Text>
      </View>
    );
  }

  const displayPeriods = sliceCloudMovementDisplayPeriods(windowPeriods);
  if (displayPeriods.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cloud Movement</Text>
        <Text style={styles.muted}>Waiting for more hourly forecast data…</Text>
      </View>
    );
  }

  const trend = inferSkyTrend(windowPeriods);
  const summary = buildCloudMovementSummary(windowPeriods, trend);

  return (
    <View style={styles.container} testID="cloud-movement-ready">
      <View style={styles.headerRow}>
        <Text style={styles.title}>Cloud Movement</Text>
        <View style={styles.forecastTag}>
          <Cloud color="#4D7CFE" size={18} />
          <Text style={styles.tagText}>{trend}</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Next ~4 hours · Direction letters are downwind (where low clouds often move from surface wind).
      </Text>

      <View style={styles.itemsRow}>
        {displayPeriods.map((period, index) => (
          <CloudItem
            key={period.startTime ?? `cm-${index}`}
            timeLabel={formatHourlyCardTimeLabel(period, index + 1)}
            skySummary={shortForecastToCloudCoverage(period.shortForecast)}
            windSpeed={period.windSpeed?.trim() ?? ""}
            driftTowardLabel={windDirectionToDownwindLabel(
              period.windDirection,
            )}
          />
        ))}
      </View>

      <View style={styles.forecastText}>
        <Text style={styles.summaryLead}>Outlook: </Text>
        <Text style={styles.summaryBody}>{summary}</Text>
        <Text style={styles.disclaimer}>
          Rough guide from the hourly forecast, not a cloud physics model.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "stretch",
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    width: "90%",
    margin: 16,
    padding: 20,
    fontFamily: "System",
  },
  headerRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  subtitle: {
    color: "#A0A0A0",
    fontSize: 11,
    marginTop: 8,
    marginBottom: 12,
  },
  forecastTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#2A2A2A",
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 100,
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  itemsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    rowGap: 16,
  },
  forecastText: {
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    width: "100%",
  },
  summaryLead: {
    fontWeight: "600",
    color: "#FFFFFF",
    fontSize: 14,
  },
  summaryBody: {
    fontWeight: "400",
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  disclaimer: {
    color: "#707070",
    fontSize: 11,
    marginTop: 10,
    lineHeight: 16,
  },
  muted: {
    color: "#A0A0A0",
    fontSize: 14,
    marginTop: 8,
  },
});

export default CloudMovement;
