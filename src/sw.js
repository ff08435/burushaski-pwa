/// <reference lib="webworker" />

import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// ✅ Push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};

  self.registration.showNotification(
    data.title || "Burushaski Reminder",
    {
      body: data.body || "Time to record sentences",
      icon: "/icon-192.png",
    }
  );
});
