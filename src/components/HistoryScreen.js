import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHistory } from "../hooks/useHistory";

const COLORS = {
  primary: "#F5730C",
  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
  background: "#f1f5f9",
  card: "#ffffff",
  textDark: "#0f172a",
  textLight: "#64748b",
};

function formatScoring(scoring) {
  if (typeof scoring !== "number") return "Sem nota";
  return "⭐".repeat(scoring) + "☆".repeat(Math.max(0, 5 - scoring));
}

function formatTimestamp(timestamp) {
  try {
    return new Date(timestamp).toLocaleString("pt-BR");
  } catch (err) {
    return timestamp;
  }
}

export default function HistoryScreen({ navigation }) {
  const { history, stats, clearHistory } = useHistory();

  const handleClear = () => {
    Alert.alert(
      "Limpar histórico",
      "Tem certeza que deseja apagar todo o histórico de leituras?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Limpar", style: "destructive", onPress: () => clearHistory() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item, index) => `${item.participantId}-${item.timestamp}-${index}`}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>Histórico de Leituras</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={[styles.statCard, { borderTopColor: COLORS.primary }]}>
                <Text style={[styles.statValue, { color: COLORS.primary }]}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={[styles.statCard, { borderTopColor: COLORS.success }]}>
                <Text style={[styles.statValue, { color: COLORS.success }]}>{stats.priority}</Text>
                <Text style={styles.statLabel}>Prioritários ⭐</Text>
              </View>
              <View style={[styles.statCard, { borderTopColor: COLORS.warning }]}>
                <Text style={[styles.statValue, { color: COLORS.warning }]}>{stats.unrated}</Text>
                <Text style={styles.statLabel}>Sem nota</Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum participante escaneado ainda</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.name ?? "Participante desconhecido"}</Text>
              <Text style={styles.itemStars}>{formatScoring(item.scoring)}</Text>
            </View>
            {item.company ? <Text style={styles.itemCompany}>{item.company}</Text> : null}
            <Text style={styles.itemAssigned}>
              Encaminhar para: {item.assignedTo || "Não atribuído"}
            </Text>
            <Text style={styles.itemTimestamp}>{formatTimestamp(item.timestamp)}</Text>
          </View>
        )}
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.homeButton]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.homeButtonText}>🏠 Voltar</Text>
        </TouchableOpacity>

        {history.length > 0 ? (
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            activeOpacity={0.85}
            onPress={handleClear}
          >
            <Text style={styles.clearButtonText}>🗑️ Limpar Histórico</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 12,
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    marginHorizontal: 4,
    borderRadius: 12,
    borderTopWidth: 4,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: "center",
  },
  item: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    flexShrink: 1,
    marginRight: 8,
  },
  itemStars: {
    fontSize: 13,
  },
  itemCompany: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  itemAssigned: {
    fontSize: 13,
    color: COLORS.textDark,
    marginTop: 6,
    fontWeight: "600",
  },
  itemTimestamp: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 8,
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
  },
  actions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  homeButton: {
    backgroundColor: COLORS.primary,
  },
  homeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  clearButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.danger,
    marginTop: 2,
  },
  clearButtonText: {
    color: COLORS.danger,
    fontSize: 15,
    fontWeight: "600",
  },
});
