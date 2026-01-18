export const config = { verify_jwt: false };

import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";

Deno.serve(async () => {
  const payload = JSON.stringify({
    title: "Burushaski Push Test",
    body: "📢 This arrived while the app was closed",
  });

  // This subscription should eventually come from DB
  const subscription = {
    endpoint: "YOUR_ENDPOINT",
    keys: {
      p256dh: "YOUR_P256DH",
      auth: "YOUR_AUTH",
    },
  };

  const vapidHeaders = {
    "Content-Type": "application/json",
  };

  return new Response(
    JSON.stringify({ ok: true }),
    { headers: vapidHeaders }
  );
});
