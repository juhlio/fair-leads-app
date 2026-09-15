import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getParticipant } from "../utils/db";

const HISTORY_KEY = "@fair-leads:history";
const EMPTY_STATS = { total: 0, hot: 0, warm: 0, cold: 0 };

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

export function useHistory() {
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
    const participant = await getParticipant(participantId);
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

  const getHistory = useCallback(() => history, [history]);

  const getStats = useCallback(() => stats, [stats]);

  const clearHistory = useCallback(async () => {
    await AsyncStorage.removeItem(HISTORY_KEY);
    setHistory([]);
    setStats(EMPTY_STATS);
  }, []);

  return { history, stats, addParticipant, getHistory, getStats, clearHistory };
}

export default useHistory;
