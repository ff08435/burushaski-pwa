import { useState, useRef } from "react";
import { db } from "../db/indexdb";
import { useUser } from "../context/UserContext";

export function useRecorder({ moduleId, sentenceId }) {
  const { user } = useUser();

  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = async () => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });

        await db.recordings.add({
          participantId: user.participantId,
          dialect: user.dialect,
          moduleId,
          sentenceId,
          audioBlob: blob,
          status: "pending",
          createdAt: new Date(),
        });

        setRecording(false);
        resolve(blob);
      };

      mediaRecorder.stop();
    });
  };

  return {
    recording,
    startRecording,
    stopRecording,
  };
}
