import { useRecorder } from "../hooks/useRecorder";
import { db } from "../db/indexdb";
import { useUser } from "../context/UserContext";

export default function SentenceCard({
  sentence,
  index,
  moduleId,
  isCompleted,
  onSubmitted,
}) {
  const { user } = useUser();

  const {
    startRecording,
    stopRecording,
    resetRecording,
    audioBlob,
    audioUrl,
    isRecording,
  } = useRecorder();

  const submit = async () => {
    if (!audioBlob || isCompleted) return;

    await db.recordings.add({
      participantId: user.participantId,
      moduleId,
      sentenceId: sentence.sentenceId,
      audio: audioBlob,
      createdAt: new Date(),
    });

    onSubmitted(sentence.sentenceId);
  };

  return (
    <div
      className={`border p-4 rounded space-y-2 ${
        isCompleted
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

      {!isCompleted && !audioUrl && (
        <div className="space-x-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-3 py-1 bg-black text-white rounded"
            >
              Record
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Stop
            </button>
          )}
        </div>
      )}

      {!isCompleted && audioUrl && (
        <div className="space-y-2">
          <audio controls src={audioUrl} />

          <div className="space-x-2">
            <button
              onClick={resetRecording}
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

      {isCompleted && (
        <p className="text-green-700 font-semibold">
          ✓ Submitted
        </p>
      )}
    </div>
  );
}
