"use client";
import OneSignal from "react-onesignal";
import { create } from "zustand";

interface StoreNotificacionesState {
  loading: boolean;
  error: string | null;
  suscribir: () => Promise<void>;
  desuscribir: () => Promise<void>;
}

const useNotificaciones = create<StoreNotificacionesState>((set) => ({
  loading: false,
  error: null,
  suscribir: async () => {
    set({ loading: true, error: null });
    try {
      const yaSuscripto = OneSignal.User?.PushSubscription?.optedIn;
      if (!yaSuscripto) {
        await OneSignal.User.PushSubscription.optIn();
      }

      const playerId = OneSignal.User?.onesignalId;
      if (!playerId) throw new Error("No se pudo obtener el ID de OneSignal");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/notificacion/suscribir`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
          },
          body: JSON.stringify({ playerId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al suscribirse");
      }

      set({ loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
  desuscribir: async () => {
    set({ loading: true, error: null });

    try {
      await OneSignal.User.PushSubscription.optOut();
      const playerId = OneSignal.User?.onesignalId;
      if (!playerId) throw new Error("No se pudo obtener el ID de OneSignal");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/notificacion/desuscribir`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
          },
          body: JSON.stringify({ playerId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al desuscribirse");
      }

      set({ loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
}));

export default useNotificaciones;
