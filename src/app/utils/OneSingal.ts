import OneSignal from "react-onesignal";
import  suscribir  from "@/app/hooks/useNotificaciones";

export async function initOneSignal() {
  if (typeof window === "undefined") return;

  await OneSignal.init({
    appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
    notifyButton: {
      enable: true,
      prenotify: true,
      showCredit: false,
      text: {
        "tip.state.unsubscribed": "Subscribe to notifications",
        "tip.state.subscribed": "You are subscribed to notifications",
        "tip.state.blocked": "You have blocked notifications",
        "message.prenotify": "Click to subscribe to notifications",
        "message.action.subscribed": "Thanks for subscribing!",
        "message.action.resubscribed": "You are subscribed to notifications",
        "message.action.unsubscribed": "You won't receive notifications again",
        "message.action.subscribing": "Subscribing...",
        "dialog.main.title": "Manage Site Notifications",
        "dialog.main.button.subscribe": "SUBSCRIBE",
        "dialog.main.button.unsubscribe": "UNSUBSCRIBE",
        "dialog.blocked.title": "Unblock Notifications",
        "dialog.blocked.message":
          "Follow these instructions to allow notifications:",
      },
    },
    allowLocalhostAsSecureOrigin: true,
  });

  suscribir();
}
