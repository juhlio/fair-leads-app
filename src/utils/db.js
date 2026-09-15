import * as SQLite from "expo-sqlite";
import { mockParticipants } from "./mockData";

const DB_NAME = "fair-leads.db";

let dbPromise = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

export async function initDatabase() {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS participants (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT,
      company TEXT,
      position TEXT,
      contact TEXT,
      classification TEXT
    );
    CREATE TABLE IF NOT EXISTS readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
  `);
  await seedDatabase();
  return db;
}

export async function seedDatabase() {
  const db = await getDb();
  const { count } = await db.getFirstAsync(
    "SELECT COUNT(*) as count FROM participants"
  );
  if (count > 0) return;

  for (const participant of mockParticipants) {
    await db.runAsync(
      `INSERT INTO participants (id, name, company, position, contact, classification)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        participant.id,
        participant.name,
        participant.company,
        participant.position,
        participant.contact,
        participant.classification,
      ]
    );
  }
}

export async function getParticipant(id) {
  const db = await getDb();
  return db.getFirstAsync("SELECT * FROM participants WHERE id = ?", [id]);
}

export async function getAllParticipants() {
  const db = await getDb();
  return db.getAllAsync("SELECT * FROM participants ORDER BY name ASC");
}

export async function addReading(participantId) {
  const db = await getDb();
  const timestamp = new Date().toISOString();
  const result = await db.runAsync(
    "INSERT INTO readings (participant_id, timestamp) VALUES (?, ?)",
    [participantId, timestamp]
  );
  return { id: result.lastInsertRowId, participant_id: participantId, timestamp };
}

export async function getReadings() {
  const db = await getDb();
  return db.getAllAsync(`
    SELECT readings.id, readings.participant_id, readings.timestamp,
           participants.name, participants.company, participants.position,
           participants.contact, participants.classification
    FROM readings
    LEFT JOIN participants ON participants.id = readings.participant_id
    ORDER BY readings.timestamp DESC
  `);
}

export async function getStatistics() {
  const db = await getDb();
  const rows = await db.getAllAsync(`
    SELECT participants.classification as classification, COUNT(*) as count
    FROM readings
    LEFT JOIN participants ON participants.id = readings.participant_id
    GROUP BY participants.classification
  `);

  const stats = { total: 0, hot: 0, warm: 0, cold: 0 };
  for (const row of rows) {
    const classification = row.classification;
    if (classification === "hot" || classification === "warm" || classification === "cold") {
      stats[classification] = row.count;
    }
    stats.total += row.count;
  }
  return stats;
}
