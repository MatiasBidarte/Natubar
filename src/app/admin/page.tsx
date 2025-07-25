'use client';
import { useUsuarioStore } from "../hooks/useUsuarioStore";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminHomePage() {
  const { usuario } = useUsuarioStore();
  if (!usuario || usuario.tipo !== 'ADMINISTRADOR') {
    return null; 
  }
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
    </main>
  );
}