import { participants } from "./participantsData";

const MIN_SIMILARITY = 0.72;

function normalize(text) {
  return (text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i += 1) {
    const curr = [i];
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = curr;
  }
  return prev[n];
}

function similarity(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

function bestLineMatchForName(normalizedLines, normalizedName) {
  let best = 0;

  for (const line of normalizedLines) {
    if (!line) continue;

    if (line.includes(normalizedName)) {
      return 1;
    }

    const words = line.split(" ");
    for (let start = 0; start < words.length; start += 1) {
      for (let end = start + 1; end <= words.length; end += 1) {
        const candidate = words.slice(start, end).join(" ");
        if (Math.abs(candidate.length - normalizedName.length) > 4) continue;
        const score = similarity(candidate, normalizedName);
        if (score > best) best = score;
      }
    }
  }

  return best;
}

export function findParticipantByRecognizedText(recognizedLines) {
  const normalizedLines = (recognizedLines ?? []).map(normalize).filter(Boolean);
  if (normalizedLines.length === 0) return null;

  let bestParticipant = null;
  let bestScore = 0;

  for (const participant of participants) {
    const fullName = normalize(`${participant.firstName} ${participant.lastName}`);
    const score = bestLineMatchForName(normalizedLines, fullName);
    if (score > bestScore) {
      bestScore = score;
      bestParticipant = participant;
    }
  }

  return bestScore >= MIN_SIMILARITY ? bestParticipant : null;
}

export function getParticipantById(id) {
  return participants.find((p) => p.id === id) ?? null;
}
