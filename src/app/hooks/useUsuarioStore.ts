import { create } from "zustand";
import { Cliente } from "./useClientes";

interface AuthState {
  usuario: Cliente | null;
  estaLogueado: boolean;
  esEmpresa: boolean;
  inicializado: boolean;
  inicializarUsuario: () => void;
  actualizarUsuario: (usuario: Cliente) => void;
  eliminarUsuario: () => void;
}

export const useUsuarioStore = create<AuthState>((set) => ({
  usuario: null,
  estaLogueado: false,
  esEmpresa: false,
  inicializado: false,

  inicializarUsuario: () => {
    if (typeof window === "undefined") return;

    try {
      const usuarioData = localStorage.getItem("usuario");
      if (usuarioData) {
        const usuario = JSON.parse(usuarioData);
        set({
          usuario,
          estaLogueado: true,
          esEmpresa: usuario.tipo === "Empresa",
          inicializado: true,
        });
      } else {
        set({ inicializado: true });
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

  eliminarUsuario: () => {
    localStorage.removeItem("usuario");
    set({ usuario: null, estaLogueado: false, esEmpresa: false });
    window.dispatchEvent(new Event("auth-change"));
  },
}));
