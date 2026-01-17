import { useRecorder } from "../hooks/useRecorder";
import { db } from "../db/indexdb";
import { useUser } from "../context/UserContext";
import { useState } from "react";

export default function SentenceCard({
  sentence,
  index,
  moduleId,
  isCompleted,
  onSubmitted,
}) {
  const { user } = useUser();

  const {
    isRecording,
    startRecording,
    stopRecording,
    resetRecording,
  } = useRecorder();

  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const isRecorded = isCompleted;

  const handleStart = async () => {
    await startRecording();
  };

  const handleStop = async () => {
    const blob = await stopRecording();
    if (blob) {
      setAudioBlob(blob);
      setAudioUrl(URL.createObjectURL(blob));
    }
  };

  const handleReset = () => {
    resetRecording();
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const submit = async () => {
    if (!audioBlob || isRecorded) return;

    await db.recordings.add({
      participantId: user.participantId,
      dialect: user.dialect,
      moduleId,
      sentenceId: sentence.sentenceId,
      audioBlob,
      status: "pending", // 🔑 offline queue
      createdAt: new Date(),
    });

    onSubmitted(sentence.sentenceId);
  };

  return (
    <div
      className={`border p-4 rounded space-y-2 transition ${
        isRecorded
          ? "bg-gray-100 opacity-60 pointer-events-none"
          : "bg-white"
      }`}
    >
      <p className="font-semibold">
        {index + 1}. {sentence.english}
      </p>

      <p className="italic text-gray-600">
        {sentence.transliteration}
      </p>

      {/* 🎙 Recording */}
      {!isRecorded && !audioUrl && (
        <div className="space-x-2">
          {!isRecording ? (
            <button
              onClick={handleStart}
              className="px-3 py-1 bg-black text-white rounded"
            >
              Record
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Stop
            </button>
          )}
        </div>
      )}

      {/* 🎧 Playback */}
      {!isRecorded && audioUrl && (
        <div className="space-y-2">
          <audio controls src={audioUrl} />

          <div className="space-x-2">
            <button
              onClick={handleReset}
              className="px-3 py-1 border rounded"
            >
              Re-record
            </button>

            <button
              onClick={submit}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* ✅ Completed */}
      {isRecorded && (
        <>
          <p className="text-green-700 font-semibold">
            ✓ Submitted
          </p>
          <span className="text-xs text-yellow-600 block">
            Saved offline • Will upload later
          </span>
        </>
      )}
    </div>
  );
}
