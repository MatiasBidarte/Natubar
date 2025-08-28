"use client";

import { useEffect, useRef } from "react";
import { create } from "zustand";
import OneSignal from "react-onesignal";
import { NotificacionIndividual } from "../types/suscripcionNotificacion";
import { useOneSignalStatus } from "./useOneSignalStatus";

interface StoreNotificacionesState {
  loadingNotificaciones: boolean;
  error: string | null;
  suscribir: () => Promise<void>;
  desuscribir: () => Promise<void>;
  recordarPago: (id: number) => Promise<void>;
  mandarNotificacion: (notificacion: NotificacionIndividual) => Promise<void>;
}

const useNotificacionesStore = create<StoreNotificacionesState>((set) => ({
  loadingNotificaciones: false,
  error: null,

  suscribir: async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    set({ loadingNotificaciones: true, error: null });
    try {
      const permiso = OneSignal.Notifications.permission as unknown as "default" | "granted" | "denied";
      if (typeof permiso !== "string") {
        throw new Error("Tipo de permiso inesperado");
      }
      if (permiso !== "granted") {
        throw new Error("Permiso de notificaciones no concedido");
      }
      await OneSignal.User.PushSubscription.optIn();
      let retries = 10;
      let playerId: string | null = null;
      let isSubscribed = false;

      while (retries-- > 0) {
        playerId = OneSignal.User?.onesignalId ?? null;
        await OneSignal.User.addTag("tipoCliente", usuario.tipo);
        isSubscribed = (await OneSignal.User.PushSubscription.optedIn) ?? false;

        if (playerId && isSubscribed) break;
        await new Promise((res) => setTimeout(res, 500));
      }

      if (!playerId || !isSubscribed) {
        throw new Error("No se pudo obtener el ID o la suscripción");
      }

      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/notificacion/suscribirDispositivo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
          },
          body: JSON.stringify({
            playerId,
            clienteId: usuario.id,
            externalId: usuario.email,
          }),
        }
      );
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || "Error al suscribirse");
      }

      set({ loadingNotificaciones: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loadingNotificaciones: false,
      });
      console.error("Error al suscribirse:", err);
    }
  },

  desuscribir: async () => {
    set({ loadingNotificaciones: true, error: null });
    try {
      await OneSignal.logout();
      await OneSignal.User.PushSubscription.optOut();

      set({ loadingNotificaciones: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loadingNotificaciones: false,
      });
    }
  },

  recordarPago: async (pedido: number) => {
    set({ loadingNotificaciones: true, error: null });
    try {
      const resp = await fetch(
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
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || "Error al recordar pago");
      }
      set({ loadingNotificaciones: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loadingNotificaciones: false,
      });
    }
  },

  mandarNotificacion: async (notificacion: NotificacionIndividual) => {
    set({ loadingNotificaciones: true, error: null });
    try {
      const resp = await fetch(
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
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || "Error al mandar notificación");
      }
      set({ loadingNotificaciones: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loadingNotificaciones: false,
      });
    }
  },
}));

export function useNotificaciones() {
  const { isSupported, isDefault, isBlocked, isGranted } = useOneSignalStatus();
  const store = useNotificacionesStore();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    if (isBlocked) {
      store.desuscribir();
      return;
    }
  }, [isSupported, isBlocked, isGranted, store]);

  return {
    ...store,
    isSupported,
    isDefault,
    isBlocked,
    canSubscribe: isSupported && !isBlocked,
  };
}


export default useNotificaciones;