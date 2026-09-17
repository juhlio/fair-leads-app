import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHistory } from "../hooks/useHistory";

const COLORS = {
  primary: "#F5730C",
  background: "#f1f5f9",
  card: "#ffffff",
  textDark: "#0f172a",
  textLight: "#64748b",
  toastBg: "#16a34a",
};

function Stars({ scoring }) {
  if (typeof scoring !== "number") {
    return <Text style={styles.noScoring}>Sem avaliação</Text>;
  }
  const stars = "⭐".repeat(scoring) + "☆".repeat(Math.max(0, 5 - scoring));
  return <Text style={styles.stars}>{stars}</Text>;
}

export default function ResultScreen({ navigation, route }) {
  const participant = route?.params?.participant;
  const { addParticipant } = useHistory();
  const [showToast, setShowToast] = useState(true);
  const toastOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (participant?.id) {
      addParticipant(participant);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participant?.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowToast(false));
    }, 2000);
    return () => clearTimeout(timer);
  }, [toastOpacity]);

  if (!participant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emptyText}>Nenhum participante selecionado.</Text>
          <TouchableOpacity
            style={[styles.button, styles.homeButton]}
            onPress={() => navigation.replace("Home")}
          >
            <Text style={styles.homeButtonText}>🏠 Início</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const fullName = `${participant.firstName} ${participant.lastName}`.trim();

  return (
    <SafeAreaView style={styles.container}>
      {showToast ? (
        <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>✓ Participante encontrado com sucesso!</Text>
        </Animated.View>
      ) : null}

      <View style={styles.content}>
        <View style={styles.card}>
          <Stars scoring={participant.scoring} />

          <Text style={styles.name}>{fullName}</Text>

          {participant.company ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Empresa</Text>
              <Text style={styles.infoValue}>{participant.company}</Text>
            </View>
          ) : null}

          {participant.jobTitle ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cargo</Text>
              <Text style={styles.infoValue}>{participant.jobTitle}</Text>
            </View>
          ) : null}

          {participant.email ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{participant.email}</Text>
            </View>
          ) : null}

          {participant.phone ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Telefone</Text>
              <Text style={styles.infoValue}>{participant.phone}</Text>
            </View>
          ) : null}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Encaminhar para</Text>
            <Text style={styles.infoValue}>{participant.assignedTo || "Não atribuído"}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.scanButton]}
            activeOpacity={0.85}
            onPress={() => navigation.replace("Scan")}
          >
            <Text style={styles.scanButtonText}>📷 Próximo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.homeButton]}
            activeOpacity={0.85}
            onPress={() => navigation.replace("Home")}
          >
            <Text style={styles.homeButtonText}>🏠 Início</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: COLORS.toastBg,
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  stars: {
    fontSize: 24,
    marginBottom: 16,
  },
  noScoring: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: 20,
  },
  infoRow: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 24,
  },
  actions: {
    marginBottom: 24,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  scanButton: {
    backgroundColor: COLORS.primary,
  },
  scanButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
  homeButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: 4,
  },
  homeButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
