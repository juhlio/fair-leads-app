import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Animated,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import * as Haptics from "expo-haptics";
import { findParticipantByRecognizedText } from "../utils/participants";

const COLORS = {
  primary: "#F5730C",
  danger: "#dc2626",
  background: "#f1f5f9",
  card: "#ffffff",
  textDark: "#0f172a",
  textLight: "#64748b",
};

const TOAST_DURATION_MS = 2200;

export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [toast, setToast] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const showToast = (message) => {
    setToast({ message });
    toastOpacity.setValue(1);
    setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setToast(null));
    }, TOAST_DURATION_MS);
  };

  const handleCapture = async () => {
    if (isProcessing || !cameraRef.current) return;
    setIsProcessing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      const result = await TextRecognition.recognize(photo.uri);
      const lines = result.blocks.flatMap((block) => block.lines.map((line) => line.text));

      const participant = findParticipantByRecognizedText(lines);

      if (participant) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.replace("Result", { participant });
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      showToast("Nenhum participante encontrado. Tente novamente.");
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showToast("Não foi possível ler o crachá. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
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
              dispositivo para ler crachás.
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
              Precisamos da sua permissão para acessar a câmera e ler o crachá do participante.
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
          <>
            <CameraView ref={cameraRef} style={styles.camera} facing="back" />
            <View style={styles.hintBox}>
              <Text style={styles.hintText}>Aponte para o nome no crachá e capture</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.footer}>
        {permission?.granted ? (
          <TouchableOpacity
            style={[styles.button, styles.captureButton, isProcessing && styles.buttonDisabled]}
            activeOpacity={0.85}
            onPress={handleCapture}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.captureButtonText}>📸 Capturar crachá</Text>
            )}
          </TouchableOpacity>
        ) : null}

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
  hintBox: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  hintText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
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
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
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
  captureButton: {
    backgroundColor: COLORS.primary,
  },
  captureButtonText: {
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
