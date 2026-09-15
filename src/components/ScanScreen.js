import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { getParticipant } from "../utils/db";

const COLORS = {
  primary: "#1e40af",
  success: "#16a34a",
  danger: "#dc2626",
  background: "#f1f5f9",
  card: "#ffffff",
  textDark: "#0f172a",
  textLight: "#64748b",
};

const MODES = {
  CAMERA: "camera",
  MANUAL: "manual",
};

export default function ScanScreen({ navigation }) {
  const [mode, setMode] = useState(MODES.CAMERA);
  const [permission, requestPermission] = useCameraPermissions();

  const [participantId, setParticipantId] = useState("");
  const [preview, setPreview] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const scanLockedRef = useRef(false);

  useEffect(() => {
    if (mode === MODES.CAMERA && permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [mode, permission, requestPermission]);

  useEffect(() => {
    if (mode === MODES.CAMERA) {
      scanLockedRef.current = false;
    }
    if (mode === MODES.MANUAL) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [mode]);

  useEffect(() => {
    let isActive = true;
    const trimmed = participantId.trim();

    if (!trimmed) {
      setPreview(null);
      return undefined;
    }

    getParticipant(trimmed)
      .then((participant) => {
        if (isActive) setPreview(participant ?? null);
      })
      .catch(() => {
        if (isActive) setPreview(null);
      });

    return () => {
      isActive = false;
    };
  }, [participantId]);

  const lookupParticipant = async (id) => {
    try {
      const participant = await getParticipant(id);
      if (participant) {
        navigation.navigate("Result", { participant });
        return true;
      }
      Alert.alert("Não encontrado", `Nenhum participante com o ID "${id}".`);
      return false;
    } catch (err) {
      Alert.alert("Erro", "Não foi possível buscar o participante.");
      return false;
    }
  };

  const handleBarcodeScanned = ({ data }) => {
    if (scanLockedRef.current) return;
    scanLockedRef.current = true;

    const id = (data ?? "").trim();
    lookupParticipant(id).finally(() => {
      scanLockedRef.current = false;
    });
  };

  const handleManualSearch = async () => {
    const trimmed = participantId.trim();
    if (!trimmed) {
      Alert.alert("Informe um ID", "Digite o ID do participante para buscar.");
      return;
    }

    setIsSearching(true);
    await lookupParticipant(trimmed);
    setIsSearching(false);
  };

  const handleCancel = () => {
    navigation.navigate("Home");
  };

  const hasQuery = participantId.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, mode === MODES.CAMERA && styles.toggleButtonActive]}
          activeOpacity={0.85}
          onPress={() => setMode(MODES.CAMERA)}
        >
          <Text
            style={[styles.toggleButtonText, mode === MODES.CAMERA && styles.toggleButtonTextActive]}
          >
            📷 Câmera
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, mode === MODES.MANUAL && styles.toggleButtonActive]}
          activeOpacity={0.85}
          onPress={() => setMode(MODES.MANUAL)}
        >
          <Text
            style={[styles.toggleButtonText, mode === MODES.MANUAL && styles.toggleButtonTextActive]}
          >
            ✍️ Manual
          </Text>
        </TouchableOpacity>
      </View>

      {mode === MODES.CAMERA ? (
        <View style={styles.cameraSection}>
          {!permission ? (
            <View style={styles.permissionBox}>
              <Text style={styles.permissionText}>Verificando permissão da câmera...</Text>
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
      ) : (
        <View style={styles.manualSection}>
          <Text style={styles.hint}>IDs disponíveis: 001-006</Text>

          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Digite o ID do participante"
            placeholderTextColor={COLORS.textLight}
            value={participantId}
            onChangeText={setParticipantId}
            onSubmitEditing={handleManualSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {hasQuery ? (
            <Text
              style={[
                styles.previewText,
                preview ? styles.previewFound : styles.previewNotFound,
              ]}
            >
              {preview
                ? `✓ ${preview.name} — ${preview.company}`
                : "Nenhum participante encontrado"}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, styles.searchButton, isSearching && styles.buttonDisabled]}
            activeOpacity={0.85}
            onPress={handleManualSearch}
            disabled={isSearching}
          >
            <Text style={styles.searchButtonText}>
              {isSearching ? "Buscando..." : "✓ Buscar"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
  toggleRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  toggleButtonTextActive: {
    color: "#ffffff",
  },
  cameraSection: {
    flex: 8,
    marginHorizontal: 20,
    marginTop: 16,
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
  manualSection: {
    flex: 8,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  hint: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: COLORS.textDark,
  },
  previewText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  previewFound: {
    color: COLORS.success,
  },
  previewNotFound: {
    color: COLORS.danger,
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
