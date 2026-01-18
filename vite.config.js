import { VitePWA } from "vite-plugin-pwa";

VitePWA({
  registerType: "autoUpdate",

  strategies: "injectManifest",
  srcDir: "src",
  filename: "sw.js",

  manifest: {
    name: "Burushaski Audio Collection",
    short_name: "Burushaski",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#facc15",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
});
