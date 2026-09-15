import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DEFAULT_COLOR = "#0f172a";

export default function StatsCard({ number, label, color = DEFAULT_COLOR }) {
  return (
    <View style={[styles.card, { borderTopColor: color }]}>
      <Text style={[styles.number, { color }]}>{number}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderTopWidth: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  number: {
    fontSize: 24,
    fontWeight: "700",
  },
  label: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
    textAlign: "center",
  },
});
