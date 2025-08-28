"use client";

import { useEffect, useState } from "react";

export function useOneSignalStatus() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined"
      ? Notification.permission
      : "default"
  );

  const isSupported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    typeof Notification !== "undefined";

  useEffect(() => {
    const update = () => setPermission(Notification.permission);

    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "notifications" })
        .then((status) => {
          status.onchange = update;
        })
        .catch(() => {
        });
    }

    window.addEventListener("focus", update);
    return () => {
      window.removeEventListener("focus", update);
    };
  }, []);

  return {
    isSupported,
    isDefault:  permission === "default",
    isBlocked:  permission === "denied",
    isGranted:  permission === "granted",
  };
}