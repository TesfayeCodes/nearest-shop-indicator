"use client";

import { useEffect } from "react";

/**
 * Registers the service worker for PWA support
 * and listens for new content available events.
 */
export function PWARegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service worker registered:", reg.scope);

          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New content available — could show a toast here
                  console.log("[PWA] New content available — refresh to update.");
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn("[PWA] Service worker registration failed:", err);
        });
    }
  }, []);

  return null;
}
