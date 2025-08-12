"use client";
import { useUsuarioStore } from "../hooks/useUsuarioStore";

export default function AdminHomePage() {
  const { usuario, esAdmin } = useUsuarioStore();
  if (!usuario || !esAdmin) {
    return null; 
  }
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
    </main>
  );
}
