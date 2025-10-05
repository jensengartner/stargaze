import { X, ZoomIn, ZoomOut } from "lucide-react-native";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const LightPolutionMapModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
        <Text style={{color: "#FFFFFF", fontSize: 18, fontWeight: 600}}>Light Pollution Map</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}><X size={18}/></TouchableOpacity>
        </View>

        {/*the map with layers*/}

<View style={styles.map}>
    <View style={{flexDirection: "row", gap: 2}}>
    <TouchableOpacity style={styles.zoomBtn}><ZoomIn size={18}/></TouchableOpacity>
    <TouchableOpacity style={styles.zoomBtn}><ZoomOut size={18}/></TouchableOpacity>
    </View>

</View>

        {/* end layers and map */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    paddingHorizontal: 12,
    paddingVertical: 24,
  },
  closeBtn: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    padding: 10,
    borderRadius: "100%",
  },
  zoomBtn: {
    backgroundColor: "#2A2A2A",
    color: "#FFFFFF",
    padding: 10,
    borderRadius: "100%",
    width: "fit-content",
  },
  map: {
    backgroundColor: "#1E1E1E",
    minHeight: 500,
  }
});

export default LightPolutionMapModal;
