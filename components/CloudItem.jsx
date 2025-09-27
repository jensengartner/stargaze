import { ArrowRight, Cloud } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

const CloudItem = () => {
  return (
    <View style={styles.container}>
      <Text style={{ color: "#A0A0A0", fontSize: 12, marginBottom: 6 }}>
        Now
      </Text>
      <Cloud
        style={{
          color: "#FFFFFF",
          backgroundColor: "#2A2A2A",
          borderRadius: 100,
          padding: 18,
        }}
      />
      <Text style={{ color: "#FFFFFF", fontSize: 12, marginTop: 6 }}>10%</Text>
      <View style={styles.arrowRow}>
        <ArrowRight style={{ color: "#A0A0A0", marginLeft: -6 }} />
        <Text style={{ color: "#A0A0A0", fontSize: 12 }}>5 mph</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
  },
  arrowRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    width: 60, // match the visual width of the Cloud icon (size + padding*2)
  },
});

export default CloudItem;
