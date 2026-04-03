import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  formatHourlyCardTimeLabel,
  sliceHourlyWindow,
  type NwsHourlyForecast,
} from "../app/api/WeatherData";
import ForecastItem from "./ForecastItem";

const CARD_OUTER_WIDTH = 88 + 12;

type Props = {
  data: NwsHourlyForecast | null;
  fetchStatus?: string;
  fetchError?: string | null;
};

const HourlyForecast = ({
  data,
  fetchStatus = "idle",
  fetchError = null,
}: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const [viewportW, setViewportW] = useState(0);
  const [contentW, setContentW] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const periods = sliceHourlyWindow(data?.properties?.periods);
  const maxScrollX = Math.max(0, contentW - viewportW);
  const atStart = scrollX <= 4;
  const atEnd = viewportW > 0 && scrollX >= maxScrollX - 4;

  const scrollBy = useCallback(
    (direction: -1 | 1) => {
      if (viewportW <= 0) return;
      const step = Math.max(CARD_OUTER_WIDTH * 2, viewportW * 0.75);
      const next = Math.max(
        0,
        Math.min(maxScrollX, scrollX + direction * step),
      );
      scrollRef.current?.scrollTo({ x: next, animated: true });
    },
    [maxScrollX, scrollX, viewportW],
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setScrollX(e.nativeEvent.contentOffset.x);
    },
    [],
  );

  const onViewportLayout = useCallback((e: LayoutChangeEvent) => {
    setViewportW(e.nativeEvent.layout.width);
  }, []);

  const onContentSizeChange = useCallback((w: number) => {
    setContentW(w);
  }, []);

  if (fetchError != null && fetchError !== "") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hourly Forecast</Text>
        <Text style={styles.errorText}>{fetchError}</Text>
      </View>
    );
  }

  if (fetchStatus === "loading" && periods.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hourly Forecast</Text>
        <Text style={styles.muted}>Loading next 8 hours…</Text>
      </View>
    );
  }

  if (periods.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hourly Forecast</Text>
        <Text style={styles.muted}>No hourly data for this location.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Hourly Forecast</Text>
        <View style={styles.arrowRow}>
          <TouchableOpacity
            style={[styles.scrollButton, atStart && styles.scrollButtonDisabled]}
            onPress={() => scrollBy(-1)}
            disabled={atStart}
            accessibilityLabel="Scroll hourly forecast earlier"
          >
            <ChevronLeft color={atStart ? "#555" : "#fff"} size={22} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.scrollButton, atEnd && styles.scrollButtonDisabled]}
            onPress={() => scrollBy(1)}
            disabled={atEnd}
            accessibilityLabel="Scroll hourly forecast later"
          >
            <ChevronRight color={atEnd ? "#555" : "#fff"} size={22} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.subtitle}>Next 8 hours from now</Text>
      <View style={styles.scrollWrap} onLayout={onViewportLayout}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onContentSizeChange={onContentSizeChange}
          contentContainerStyle={styles.scrollContent}
        >
          {periods.map((period, index) => (
            <ForecastItem
              key={period.startTime ?? `h-${index}`}
              period={period}
              timeLabel={formatHourlyCardTimeLabel(period, index)}
            />
          ))}
        </ScrollView>
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
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    color: "#A0A0A0",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  arrowRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  scrollButton: {
    backgroundColor: "#2A2A2A",
    padding: 6,
    borderRadius: 100,
  },
  scrollButtonDisabled: {
    opacity: 0.45,
  },
  scrollWrap: {
    width: "100%",
    marginTop: 4,
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingRight: 8,
  },
  muted: {
    color: "#A0A0A0",
    marginTop: 12,
  },
  errorText: {
    color: "#FF6B6B",
    marginTop: 12,
  },
});

export default HourlyForecast;
