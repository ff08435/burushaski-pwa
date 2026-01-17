import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSentences } from "../hooks/useSentences";
import SentenceCard from "../Components/SentenceCard";
import { db } from "../db/indexdb";
import { useUser } from "../context/UserContext";
import ProgressBar from "../Components/ProgressBar";

export default function ModuleView() {
  const params = useParams();
  const moduleId = params?.moduleId; // ✅ SAFE ACCESS

  const data = useSentences();
  const { user, loading } = useUser();
  const [completed, setCompleted] = useState([]);

  // ⏳ Wait for user hydration
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading…
      </div>
    );
  }

  // 🔐 Auth guard
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 🚨 Route guard (THIS FIXES BLANK SCREEN)
  if (!moduleId) {
    return (
      <div className="p-6 text-white">
        Invalid module URL
      </div>
    );
  }

  useEffect(() => {
    db.recordings
      .where({ participantId: user.participantId, moduleId })
      .toArray()
      .then((rows) =>
        setCompleted(rows.map((r) => r.sentenceId))
      );
  }, [moduleId, user.participantId]);

  if (!data) return null;

  const module = data.modules.find(
    (m) => m.moduleId === moduleId
  );

  if (!module) {
    return (
      <div className="p-6 text-white">
        Module not found
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
        {module.title}
      </h1>

      <ProgressBar
        completed={completed.length}
        total={module.sentences.length}
      />

      {module.sentences.map((sentence, index) => (
        <SentenceCard
          key={sentence.sentenceId}
          sentence={sentence}
          index={index}
          moduleId={moduleId}
          isCompleted={completed.includes(sentence.sentenceId)}
          onSubmitted={(sid) =>
            setCompleted((prev) => [...prev, sid])
          }
        />
      ))}
    </div>
  );
}
