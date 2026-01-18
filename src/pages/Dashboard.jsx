import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useSentences } from "../hooks/useSentences";
import { db } from "../db/indexdb";
import { useUser } from "../context/UserContext";
import ProgressBar from "../Components/ProgressBar";
import ReminderBanner from "../Components/ReminderBanner";
import { requestNotificationPermission } from "../hooks/useNotifications";
import { sendReminderNotification } from "../utils/notify";
import { subscribeToPush } from "../hooks/useNotifications"; ///ADDED THIS

useEffect(() => {
  subscribeToPush();
}, []);


export default function Dashboard() {
  const data = useSentences();
  const { user } = useUser();
  const navigate = useNavigate();

  // 🔐 AUTH GUARD — must be first
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const [completedMap, setCompletedMap] = useState({});
  const [notificationSent, setNotificationSent] = useState(false);

  // 🔄 Load progress from IndexedDB
  useEffect(() => {
    if (!data || !user) return;

    const loadProgress = async () => {
      const rows = await db.recordings
        .where({ participantId: user.participantId })
        .toArray();

      const map = {};
      rows.forEach((r) => {
        map[r.moduleId] = (map[r.moduleId] || 0) + 1;
      });

      setCompletedMap(map);
    };

    loadProgress();
  }, [data, user]);

  if (!data) return <p className="p-4">Loading…</p>;

  // 🔔 REMINDER LOGIC
  let reminderMessage = null;

  const incompleteModules = data.modules.filter((module) => {
    const completed = completedMap[module.moduleId] || 0;
    return completed < module.sentences.length;
  });

  if (incompleteModules.length > 0) {
    const mod = incompleteModules[0];
    const completed = completedMap[mod.moduleId] || 0;
    const remaining = mod.sentences.length - completed;

    reminderMessage = `You have ${remaining} sentences left in "${mod.title}".`;
  }

  // 🔔 Browser notification (fire once)
  useEffect(() => {
    if (!reminderMessage || notificationSent) return;

    requestNotificationPermission().then(() => {
      sendReminderNotification(
        "Burushaski Recording Reminder",
        reminderMessage
      );
      setNotificationSent(true);
    });
  }, [reminderMessage, notificationSent]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
        Modules
      </h1>

      {reminderMessage && (
        <ReminderBanner message={reminderMessage} />
      )}

      {data.modules.map((module) => {
        const completed = completedMap[module.moduleId] || 0;
        const total = module.sentences.length;
        const isCompleted = total > 0 && completed === total;

        return (
          <div
            key={module.moduleId}
            onClick={() =>
              !isCompleted && navigate(`/module/${module.moduleId}`)
            }
            className={`border p-4 rounded space-y-2 ${
              isCompleted
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-white cursor-pointer hover:bg-gray-100"
            }`}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{module.title}</h2>

              {isCompleted && (
                <span className="text-green-700 font-semibold text-sm">
                  ✓ Completed
                </span>
              )}
            </div>

            <ProgressBar completed={completed} total={total} small />
          </div>
        );
      })}
    </div>
  );
}
