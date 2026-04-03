import { Cloud } from "lucide-react-native";
import type { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  timeLabel: string;
  skySummary: string;
  windSpeed: string;
  /** Compass phrase for where clouds tend to drift (downwind from surface wind). */
  driftTowardLabel: string;
};

const CloudItem: FC<Props> = ({
  timeLabel,
  skySummary,
  windSpeed,
  driftTowardLabel,
}) => {
  const windDisplay = windSpeed.trim() !== "" ? windSpeed : "—";

  return (
    <View style={styles.container}>
      <Text style={styles.timeLabel}>{timeLabel}</Text>
      <View style={styles.cloudCircle}>
        <Cloud color="#FFFFFF" size={28} />
      </View>
      <Text style={styles.skyText} numberOfLines={3}>
        {skySummary}
      </Text>
      <View style={styles.driftBlock}>
        <Text style={styles.driftDirection} numberOfLines={1}>
          {driftTowardLabel}
        </Text>
        <Text style={styles.windText} numberOfLines={2}>
          {windDisplay}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    width: 72,
    minHeight: 120,
  },
  timeLabel: {
    color: "#A0A0A0",
    fontSize: 11,
    marginBottom: 6,
    textAlign: "center",
  },
  cloudCircle: {
    backgroundColor: "#2A2A2A",
    borderRadius: 100,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  skyText: {
    color: "#FFFFFF",
    fontSize: 10,
    marginTop: 6,
    textAlign: "center",
    width: "100%",
  },
  driftBlock: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    width: "100%",
    gap: 2,
  },
  driftDirection: {
    color: "#C8C8C8",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    width: "100%",
  },
  windText: {
    color: "#A0A0A0",
    fontSize: 10,
    textAlign: "center",
    width: "100%",
  },
});

export default CloudItem;
