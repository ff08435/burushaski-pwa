import { db } from "../db/indexdb";

/**
 * Upload all pending recordings when online
 */
export async function syncPendingRecordings() {
  if (!navigator.onLine) return;

  const pending = await db.recordings
    .where("status")
    .equals("pending")
    .toArray();

  if (pending.length === 0) return;

  console.log("📡 Syncing", pending.length, "recordings...");

  for (const record of pending) {
    try {
      // ⚠️ TEMP: simulate upload (replace later with real API)
      await fakeUpload(record);

      // ✅ Mark as synced
      await db.recordings.update(record.id, {
        status: "synced",
        syncedAt: new Date(),
      });

      console.log("✅ Uploaded:", record.sentenceId);
    } catch (err) {
      console.error("❌ Upload failed:", record.id, err);
    }
  }
}

/**
 * Fake upload for now (replace with real API later)
 */
function fakeUpload(record) {
  return new Promise((resolve) => {
    setTimeout(resolve, 800); // simulate network delay
  });
}
