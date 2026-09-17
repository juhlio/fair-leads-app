import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "@fair-leads:history";

const HistoryContext = createContext(null);

function computeStats(entries) {
  return entries.reduce(
    (acc, entry) => {
      acc.total += 1;
      if (typeof entry.scoring === "number" && entry.scoring >= 4) {
        acc.priority += 1;
      } else if (entry.scoring == null) {
        acc.unrated += 1;
      }
      return acc;
    },
    { total: 0, priority: 0, unrated: 0 }
  );
}

const EMPTY_STATS = computeStats([]);

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

  const addParticipant = useCallback(async (participant) => {
    const entry = {
      participantId: participant.id,
      name: `${participant.firstName} ${participant.lastName}`.trim(),
      company: participant.company ?? null,
      jobTitle: participant.jobTitle ?? null,
      scoring: participant.scoring ?? null,
      assignedTo: participant.assignedTo || null,
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
