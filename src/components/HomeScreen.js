import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#F5730C",
  success: "#16a34a",
  warning: "#d97706",
  background: "#f1f5f9",
  card: "#ffffff",
  textDark: "#0f172a",
  textLight: "#64748b",
};

export default function HomeScreen({ navigation, stats }) {
  const safeStats = stats ?? { total: 0, priority: 0, unrated: 0 };

  const statCards = [
    { key: "total", label: "Total", value: safeStats.total, color: COLORS.primary, icon: "👥" },
    { key: "priority", label: "Prioritários ⭐", value: safeStats.priority, color: COLORS.success, icon: "⭐" },
    { key: "unrated", label: "Sem nota", value: safeStats.unrated, color: COLORS.warning, icon: "❔" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Qualificador de Leads</Text>
        <Text style={styles.subtitle}>Feira Essencial Energia</Text>
      </View>

      <View style={styles.statsList}>
        {statCards.map((item) => (
          <View key={item.key} style={[styles.statCard, { borderTopColor: item.color }]}>
            <Text style={styles.statIcon}>{item.icon}</Text>
            <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.scanButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Scan")}
        >
          <Text style={styles.scanButtonText}>📷 Ler Crachá</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("History")}
        >
          <Text style={styles.historyButtonText}>📋 Ver Histórico</Text>
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
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 14,
    color: "#dbeafe",
    marginTop: 4,
  },
  statsList: {
    flexDirection: "row",
    paddingHorizontal: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    marginHorizontal: 4,
    borderRadius: 12,
    borderTopWidth: 4,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: "center",
  },
  actions: {
    marginTop: 28,
    paddingHorizontal: 20,
    gap: 12,
  },
  scanButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  scanButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  historyButton: {
    backgroundColor: COLORS.card,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: 4,
  },
  historyButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },
});
