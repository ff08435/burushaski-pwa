export const config = {
  runtime: "nodejs",
};

import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:test@example.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const subscription = req.body; // ✅ Node-style body

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Burushaski Push Test",
        body: "🎉 This arrived while the app was closed",
      })
    );

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Push error:", err);
    return res.status(500).json({ error: err.message });
  }
}
