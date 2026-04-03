import { Clock, Cloud, CloudLightning, CloudRain, Sun } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import type { NwsHourlyPeriod } from "../app/api/WeatherData";

type Props = {
  period: NwsHourlyPeriod;
  timeLabel: string;
};

function ForecastWeatherIcon({ shortForecast }: { shortForecast?: string }) {
  const s = (shortForecast ?? "").toLowerCase();
  if (/\bthunder|t-storm|lightning\b/.test(s)) {
    return <CloudLightning color="#A0A0A0" size={36} />;
  }
  if (/\brain|shower|storm|drizzle|snow|precip\b/.test(s)) {
    return <CloudRain color="#A0A0A0" size={36} />;
  }
  if (/\bclear|sunny|fair\b/.test(s)) {
    return <Sun color="#A0A0A0" size={36} />;
  }
  return <Cloud color="#A0A0A0" size={36} />;
}

const ForecastItem = ({ period, timeLabel }: Props) => {
  const temp =
    period.temperature != null && period.temperatureUnit != null
      ? `${period.temperature}°${period.temperatureUnit}`
      : "—";
  const summary = period.shortForecast ?? "—";

  return (
    <View style={styles.container}>
      <View style={styles.timeRow}>
        <Clock color="#A0A0A0" size={14} />
        <Text style={styles.timeText}>{timeLabel}</Text>
      </View>
      <View style={styles.weatherBlock}>
        <ForecastWeatherIcon shortForecast={period.shortForecast} />
        <Text style={styles.tempText}>{temp}</Text>
      </View>
      <Text style={styles.summaryText} numberOfLines={3} ellipsizeMode="tail">
        {summary}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    width: 88,
    marginHorizontal: 6,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    gap: 4,
    width: "100%",
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginLeft: 2,
  },
  weatherBlock: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  tempText: {
    color: "#FFFFFF",
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  summaryText: {
    color: "#A0A0A0",
    fontSize: 11,
    textAlign: "center",
    width: "100%",
    minHeight: 36,
  },
});

export default ForecastItem;
