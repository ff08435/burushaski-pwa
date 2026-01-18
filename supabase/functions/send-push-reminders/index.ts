import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import webpush from "npm:web-push";

serve(async () => {
  webpush.setVapidDetails(
    "mailto:test@example.com",
    Deno.env.get("VAPID_PUBLIC_KEY")!,
    Deno.env.get("VAPID_PRIVATE_KEY")!
  );

  const subscription = {
    endpoint: "https://fcm.googleapis.com/fcm/send/dQR_R-ilpNU:APA91bH0I5KANt2eyUUlbAFW6HgMDkQaFj4l60GAfhkG4Je_yJdnw2-IU-48YaL5ahs2gtBDl7yDU1RsehX3BXOTC6XXayBqz7ibHWXTE3I1A_xX6-nY_pSGFJ_oCEH25wt3xhvO-0AD",
    keys: {
      p256dh: "BEPC0xm6P7YepoHWNzudccvd2cQMXUslVGB0WNdT08NTpkUNYA1PDEKUsL-gIAqyGdS10HfrtnQ5cEuZ-nEsGx8",
      auth: "33qx8SoiXUxz88yV4EiYuw",
    },
  };

  await webpush.sendNotification(
    subscription,
    JSON.stringify({
      title: "Burushaski Push Test",
      body: "🎉 This arrived while the app was closed",
    })
  );

  return new Response("Push sent");
});
