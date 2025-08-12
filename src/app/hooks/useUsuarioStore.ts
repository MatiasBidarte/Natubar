import { create } from "zustand";
import { Cliente } from "./useClientes";
import { decodeToken } from "@/app/utils/decodeJwt";

interface AuthState {
  usuario: Cliente | null;
  estaLogueado: boolean;
  esEmpresa: boolean;
  esAdmin: boolean;
  inicializado: boolean;
  inicializarUsuario: () => void;
  actualizarUsuario: (usuario: Cliente) => void;
  cerrarSesion: () => void;
  verificarIntegridad: () => void;
}

export const useUsuarioStore = create<AuthState>((set) => ({
  usuario: null,
  estaLogueado: false,
  esEmpresa: false,
  esAdmin: false,
  inicializado: false,

  inicializarUsuario: () => {
    try {
      const usuarioData = localStorage.getItem("usuario");
      if (usuarioData) {
        const usuario = JSON.parse(usuarioData);
        set({
          usuario,
          estaLogueado: true,
          esEmpresa: usuario.tipo === "Empresa",
          esAdmin: (usuario.tipo === "ADMINISTRADOR") || (usuario.tipo === "Administrador"),
          inicializado: true,
        });
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      set({ inicializado: true });
    }
  },

  actualizarUsuario: (usuario) => {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    set({
      usuario,
      estaLogueado: true,
      esEmpresa: usuario.tipo === "Empresa",
    });
    window.dispatchEvent(new Event("auth-change"));
  },

  cerrarSesion: () => {
    localStorage.removeItem("usuario");
    set({ usuario: null, estaLogueado: false, esEmpresa: false });
    window.dispatchEvent(new Event("auth-change"));
    window.location.href = "/";
  },

  verificarIntegridad: () => {
    try {
      const usuarioData = localStorage.getItem("usuario");
      if (usuarioData) {
        const usuario = JSON.parse(usuarioData);
        if (usuario) {
          const usuarioParsed = JSON.parse(
            JSON.stringify({
              ...decodeToken(usuario.token),
              token: usuario.token,
            })
          );
          if (JSON.stringify(usuario) !== JSON.stringify(usuarioParsed)) {
            localStorage.removeItem("usuario");
            set({ usuario: null, estaLogueado: false, esEmpresa: false });
            window.dispatchEvent(new Event("auth-change"));
            window.location.href = "/";
          }
        }
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    }
  },
}));
