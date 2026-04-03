import { Cloud } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import type { NwsHourlyForecast } from "../app/api/WeatherData";
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

  const hasForecast = (data?.properties?.periods?.length ?? 0) > 0;

  return (
    <View
      style={styles.container}
      testID={hasForecast ? "cloud-movement-ready" : "cloud-movement-pending"}
    >
      {/*title and tag*/}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 8,
          }}
        >
          Cloud Movement
        </Text>
        <View style={styles.forecastTag}>
          <Cloud color="#4D7CFE" size={18} />
          <Text style={{ color: "#FFFFFF" }}>Clearing</Text>
        </View>
      </View>
      {/*little cloud icons very cute*/}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 16,
        }}
      >
        <CloudItem />
        <CloudItem />
        <CloudItem />
        <CloudItem />
      </View>

      <View style={styles.forecastText}>
        <Text style={{ fontWeight: "500", color: "#FFFFFF" }}>
          Forecast:{" "}
          <Text style={{ fontWeight: "400", color: "#FFFFFF" }}>
            Clouds are moving northeast and clearing. Excellent visibility
            expected within 2 hours.
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    width: "90%",
    margin: 16,
    padding: 20,
    fontFamily: "System",
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
  forecastText: {
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    width: "100%",
  },
});

export default CloudMovement;
