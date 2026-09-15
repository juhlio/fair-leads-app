import * as SQLite from "expo-sqlite";
import { mockParticipants } from "./mockData";

const DB_NAME = "fair-leads.db";

let dbPromise = null;

async function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME).catch((err) => {
      dbPromise = null;
      throw err;
    });
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

