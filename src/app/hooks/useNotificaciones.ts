"use client";
import OneSignal from "react-onesignal";
import { create } from "zustand";
import { NotificacionIndividual } from "../types/suscripcionNotificacion";

interface StoreNotificacionesState {
  loading: boolean;
  error: string | null;
  suscribir: () => Promise<void>;
  desuscribir: () => Promise<void>;
  recordarPago: (id: number) => Promise<void>;
  mandarNotificacion: (notificacion : NotificacionIndividual) => Promise<void>;
}

export interface SuscripcionNotificacion {
  playerId: string;
  clienteId: number;
}

const useNotificaciones = create<StoreNotificacionesState>((set) => ({
  loading: false,
  error: null,
suscribir: async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  set({ loading: true, error: null });
  try {
    await OneSignal.User.PushSubscription.optIn();

    let retries = 10;
    let playerId: string | null = null;
    let isSubscribed = false;

    while (retries-- > 0) {
      playerId = OneSignal.User?.onesignalId ?? null;
      await OneSignal.User.addTag("tipoCliente",usuario.tipo)
      isSubscribed = (await OneSignal.User.PushSubscription.optedIn) ?? false;

      if (playerId && typeof playerId === "string" && isSubscribed) {
        break;
      }

      await new Promise((res) => setTimeout(res, 500));
    }

    if (!playerId || !isSubscribed) {
      throw new Error("No se pudo obtener el ID de OneSignal o no está suscripto");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/notificacion/suscribirDispositivo`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
        },
        body: JSON.stringify({
          playerId,
          clienteId: usuario?.id,
          externalId: usuario?.email,
        }),
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
    console.error("Error al suscribirse a las notificaciones:", err);
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
  recordarPago: async (pedido: number) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/notificacion/recordarPago`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
          },
          body: JSON.stringify({ pedido }),
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
    mandarNotificacion: async (notificacion: NotificacionIndividual) => {
    set({ loading: true, error: null });
    try {
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/notificacion/mandarNotificacion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
          },
          body: JSON.stringify(notificacion),
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
