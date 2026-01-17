import Dexie from "dexie";

export const db = new Dexie("burushaski_pwa");

db.version(1).stores({
  recordings: "++id, participantId, moduleId, sentenceId",
});
