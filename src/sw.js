/// <reference lib="webworker" />

import { precacheAndRoute } from "workbox-precaching";

// This will be injected by Vite PWA
precacheAndRoute(self.__WB_MANIFEST || []);

// REQUIRED: allow the SW to activate immediately
self.skipWaiting();
self.clientsClaim();

/* ===========================
   PUSH NOTIFICATIONS
   =========================== */

self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data.json();
  } catch {
    data = {
      title: "Burushaski Reminder",
      body: "You have pending recordings",
    };
  }

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [100, 50, 100],
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes("/dashboard")) {
          return client.focus();
        }
      }
      return self.clients.openWindow("/dashboard");
    })
  );
});
