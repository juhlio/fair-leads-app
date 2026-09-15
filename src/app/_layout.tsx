import { Tabs } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

import { useDatabase } from "@/hooks/useDatabase";

const COLORS = {
  active: "#1e40af",
  inactive: "#94a3b8",
  background: "#f1f5f9",
  textDark: "#0f172a",
  danger: "#dc2626",
};

export default function RootLayout() {
  const { isReady, error } = useDatabase();

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Não foi possível iniciar o banco de dados do app.
        </Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Histórico",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text>,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 15,
    color: COLORS.textDark,
  },
  errorText: {
    fontSize: 15,
    color: COLORS.danger,
    textAlign: "center",
  },
});
