import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { getParticipant } from "../utils/db";

const COLORS = {
  primary: "#F5730C",
  success: "#16a34a",
  danger: "#dc2626",
  background: "#f1f5f9",
  card: "#ffffff",
  textDark: "#0f172a",
  textLight: "#64748b",
};

const TOAST_DURATION_MS = 1800;

export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [toast, setToast] = useState(null);
  const scanLockedRef = useRef(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const showToast = (message, onHide) => {
    setToast({ message });
    toastOpacity.setValue(1);
    setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setToast(null);
        onHide?.();
      });
    }, TOAST_DURATION_MS);
  };

  const lookupParticipant = async (id, { onDismiss } = {}) => {
    try {
      const participant = await getParticipant(id);
      if (participant) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.replace("Result", { participant });
        return true;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      showToast(`Nenhum participante com o ID "${id}".`, onDismiss);
      return false;
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showToast("Não foi possível buscar o participante.", onDismiss);
      return false;
    }
  };

  const handleBarcodeScanned = ({ data }) => {
    if (scanLockedRef.current) return;
    scanLockedRef.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const id = (data ?? "").trim();
    lookupParticipant(id, {
      onDismiss: () => {
        scanLockedRef.current = false;
      },
    });
  };

  const handleCancel = () => {
    navigation.replace("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      {toast ? (
        <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      ) : null}

      <View style={styles.cameraSection}>
        {!permission ? (
          <View style={styles.permissionBox}>
            <Text style={styles.permissionText}>Verificando permissão da câmera...</Text>
          </View>
        ) : !permission.granted && !permission.canAskAgain ? (
          <View style={styles.permissionBox}>
            <Text style={styles.permissionText}>
              O acesso à câmera foi negado. Habilite a permissão de câmera nas configurações do
              dispositivo para escanear QR codes.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.searchButton]}
              activeOpacity={0.85}
              onPress={() => Linking.openSettings()}
            >
              <Text style={styles.searchButtonText}>Abrir configurações</Text>
            </TouchableOpacity>
          </View>
        ) : !permission.granted ? (
          <View style={styles.permissionBox}>
            <Text style={styles.permissionText}>
              Precisamos da sua permissão para acessar a câmera e escanear QR codes.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.searchButton]}
              activeOpacity={0.85}
              onPress={requestPermission}
            >
              <Text style={styles.searchButtonText}>Permitir acesso à câmera</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={handleBarcodeScanned}
          />
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          activeOpacity={0.85}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>✕ Cancelar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  toast: {
    position: "absolute",
    top: 16,
    left: 20,
    right: 20,
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  toastText: {
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
  },
  cameraSection: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },
  permissionBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: COLORS.card,
  },
  permissionText: {
    fontSize: 15,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    marginTop: 20,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  cancelButtonText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: "600",
  },
});
