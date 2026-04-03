import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { searchOpenMeteoLocations } from "../app/api/geocode";

const DEBOUNCE_MS = 300;

const LocationSearchModal = ({ visible, onClose, onSelectLocation }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!visible) {
      setQuery("");
      setDebouncedQuery("");
      setResults([]);
      setStatus("idle");
      setErrorMessage(null);
      return;
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query, visible]);

  useEffect(() => {
    if (!visible) return;

    const q = debouncedQuery.trim();
    if (q.length < 2) {
      setResults([]);
      setStatus("idle");
      setErrorMessage(null);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    setStatus("loading");
    setErrorMessage(null);

    (async () => {
      try {
        const { places } = await searchOpenMeteoLocations(q, {
          signal: controller.signal,
          count: 10,
        });
        if (cancelled) return;
        setResults(places);
        setStatus(places.length > 0 ? "success" : "idle");
      } catch (e) {
        if (cancelled || e?.name === "AbortError") return;
        setResults([]);
        setStatus("error");
        setErrorMessage(
          e instanceof Error ? e.message : "Something went wrong",
        );
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [debouncedQuery, visible]);

  const handleSelect = (place) => {
    onSelectLocation({
      label: place.label,
      lat: place.lat,
      lon: place.lon,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Location Search</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>
            Type at least 2 characters (US locations; matches NOAA coverage).
          </Text>

          <View style={styles.searchBar}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
              placeholder="City or ZIP"
              placeholderTextColor="#666"
              autoCorrect={false}
              autoCapitalize="words"
            />
          </View>

          {status === "loading" && (
            <View style={styles.centerRow}>
              <ActivityIndicator color="#4D7CFE" />
              <Text style={styles.muted}>Searching…</Text>
            </View>
          )}

          {status === "error" && errorMessage != null && (
            <Text style={styles.error}>{errorMessage}</Text>
          )}

          {status !== "loading" &&
            debouncedQuery.trim().length >= 2 &&
            results.length === 0 &&
            status !== "error" && (
              <Text style={styles.muted}>No results. Try another search.</Text>
            )}

          <FlatList
            data={results}
            keyExtractor={(item, index) =>
              item.id != null ? String(item.id) : `place-${index}`
            }
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultRow}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.resultLabel}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#121212",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "85%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  hint: {
    color: "#A0A0A0",
    fontSize: 13,
    marginBottom: 12,
  },
  closeBtn: {
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 100,
  },
  searchBar: {
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  searchInput: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  centerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  muted: {
    color: "#A0A0A0",
    fontSize: 14,
  },
  error: {
    color: "#FF6B6B",
    fontSize: 14,
    marginBottom: 8,
  },
  list: {
    flexGrow: 0,
    maxHeight: 320,
  },
  resultRow: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#2A2A2A",
  },
  resultLabel: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default LocationSearchModal;
