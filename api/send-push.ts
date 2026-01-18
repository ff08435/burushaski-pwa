import type { NextApiRequest, NextApiResponse } from "next";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:test@example.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subscription, title, body } = req.body;

  if (!subscription) {
    return res.status(400).json({ error: "Missing subscription" });
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: title || "Burushaski Reminder",
        body: body || "Please record your pending sentences",
      })
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Push failed" });
  }
}
