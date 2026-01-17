// src/hooks/useRecorder.js
import { useState, useRef } from "react";

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
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
    setIsRecording(true);
  };

  const stopRecording = () => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        setIsRecording(false);
        resolve(blob);
      };

      mediaRecorder.stop();
    });
  };

  const resetRecording = () => {
    chunksRef.current = [];
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
