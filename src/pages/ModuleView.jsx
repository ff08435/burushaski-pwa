import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSentences } from "../hooks/useSentences";
import SentenceCard from "../Components/SentenceCard";
import { db } from "../db/indexdb";
import { useUser } from "../context/UserContext";
import ProgressBar from "../Components/ProgressBar";

export default function ModuleView() {
  const { moduleId } = useParams();
  const data = useSentences();
  const { user } = useUser();

  // 🔐 AUTH GUARD
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const [completed, setCompleted] = useState([]);

  // 🔄 Load recorded sentences (online OR offline)
  useEffect(() => {
    if (!user?.participantId) return;

    db.recordings
      .where({ participantId: user.participantId, moduleId })
      .toArray()
      .then((rows) =>
        setCompleted(rows.map((r) => r.sentenceId))
      );
  }, [moduleId, user?.participantId]);

  if (!data) return null;

  const module = data.modules.find(
    (m) => m.moduleId === moduleId
  );

  if (!module) {
    return <p className="p-4">Module not found</p>;
  }

  const allCompleted =
    completed.length === module.sentences.length &&
    module.sentences.length > 0;

  return (
    <div className="p-6 space-y-4">
      {/* Module Title */}
      <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
        {module.title}
      </h1>

      {/* Progress */}
      <ProgressBar
        completed={completed.length}
        total={module.sentences.length}
      />

      {allCompleted && (
        <p className="text-green-500 font-semibold">
          Module complete 🎉
        </p>
      )}

      {/* Sentences */}
      <div className="space-y-3">
        {module.sentences.map((sentence, index) => {
          const isRecorded = completed.includes(sentence.sentenceId);

          return (
            <div key={sentence.sentenceId}>
              <SentenceCard
                sentence={sentence}
                index={index}
                moduleId={moduleId}
                isCompleted={isRecorded}
                onSubmitted={(sid) =>
                  setCompleted((prev) => [...prev, sid])
                }
              />

              {/* Offline queue indicator */}
              {isRecorded && (
                <p className="text-xs text-yellow-400 mt-1 ml-2">
                  Saved offline • will upload when online
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
