import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getParticipant } from "../utils/db";

const HISTORY_KEY = "@fair-leads:history";
const EMPTY_STATS = { total: 0, hot: 0, warm: 0, cold: 0 };

const HistoryContext = createContext(null);

function computeStats(entries) {
  return entries.reduce(
    (acc, entry) => {
      acc.total += 1;
      if (entry.classification in acc) {
        acc[entry.classification] += 1;
      }
      return acc;
    },
    { ...EMPTY_STATS }
  );
}

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);

  const loadHistory = useCallback(async () => {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    const entries = raw ? JSON.parse(raw) : [];
    setHistory(entries);
    setStats(computeStats(entries));
    return entries;
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addParticipant = useCallback(async (participantId) => {
    let participant = null;
    try {
      participant = await getParticipant(participantId);
    } catch (err) {
      participant = null;
    }

    const entry = {
      participantId,
      name: participant?.name ?? null,
      company: participant?.company ?? null,
      classification: participant?.classification ?? null,
      timestamp: new Date().toISOString(),
    };

    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    const entries = raw ? JSON.parse(raw) : [];
    const updated = [entry, ...entries];

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    setHistory(updated);
    setStats(computeStats(updated));
    return entry;
  }, []);

  const clearHistory = useCallback(async () => {
    await AsyncStorage.removeItem(HISTORY_KEY);
    setHistory([]);
    setStats(EMPTY_STATS);
  }, []);

  const value = useMemo(
    () => ({ history, stats, addParticipant, clearHistory }),
    [history, stats, addParticipant, clearHistory]
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
}

export default useHistory;
