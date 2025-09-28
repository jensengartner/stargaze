import { Clock, Cloud, Star } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

const ForecastItem = () => {
  return (
    <View style={styles.container}>
      {/* Time */}
      <View style={styles.timeRow}>
        <Clock style={{ color: "#A0A0A0" }} size={14} />
        <Text style={styles.timeText}>9 PM</Text>
      </View>
      {/* Weather */}


<Cloud style={{color: "#A0A0A0", marginTop: 6}} size={40}/>
    <Text style={{color: "#FFFFFF", marginBottom: 6, fontSize: 12}}>59°</Text>


      {/* Events */}
      <View style={styles.eventRow}>
        <Star style={{ color: "#4D7CFE" }} size={14} />
        <Text
          style={styles.eventText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Jupiter visible
        </Text>
      </View>
      <View style={styles.eventRow}>
        <Star style={{ color: "#4D7CFE" }} size={14} />
        <Text
          style={styles.eventText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          ISS pass
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    width: 80, // or adjust as needed for your layout
    marginHorizontal: 4,
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
    marginLeft: 4,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    width: "100%",
    minWidth: 0,
    marginTop: 2,
  },
  eventText: {
    color: "#A0A0A0",
    fontSize: 12,
    flex: 1,
    minWidth: 0,
  },
    weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 10,
    gap: 4,
    width: "100%",
  },
  tempText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cloudText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 4,
  },
  percentText: {
    color: "#A0A0A0",
    fontSize: 12,
    marginLeft: 4,
  },
});

export default ForecastItem;