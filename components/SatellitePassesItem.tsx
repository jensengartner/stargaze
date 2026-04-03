import { Clock, Satellite } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export type SatellitePassRow = {
  id: string;
  name: string;
  timeRange: string;
  detail: string | null;
  visible: boolean;
};

type Props = {
  row: SatellitePassRow;
};

const SatellitePassesItem = ({ row }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Satellite color="#4D7CFE" size={24} />
        <View style={styles.textCol}>
          <Text style={styles.name}>{row.name}</Text>
          <View style={styles.timeRow}>
            <Clock color="#A0A0A0" size={14} />
            <Text style={styles.timeText}>{row.timeRange}</Text>
          </View>
          {row.detail != null && row.detail !== "" ? (
            <Text style={styles.detail}>{row.detail}</Text>
          ) : null}
        </View>
      </View>
      <Text
        style={[
          styles.tag,
          row.visible ? styles.tagVisible : styles.tagMuted,
        ]}
      >
        {row.visible ? "Visible" : "Low"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "System",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  timeText: {
    color: "#A0A0A0",
    fontSize: 14,
  },
  detail: {
    color: "#707070",
    fontSize: 12,
    marginTop: 4,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginLeft: 8,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "600",
  },
  tagVisible: {
    backgroundColor: "#4D7CFE",
    color: "#FFFFFF",
  },
  tagMuted: {
    backgroundColor: "#3A3A3A",
    color: "#A0A0A0",
  },
});

export default SatellitePassesItem;
