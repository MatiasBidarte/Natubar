"use client";
import { useUsuarioStore } from '../hooks/useUsuarioStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { usuario, inicializado } = useUsuarioStore();
  const router = useRouter();
  useEffect(() => {
    if (inicializado && (!usuario || usuario.tipo !== 'ADMINISTRADOR')) {
      router.push('/');
    }
  }, [usuario]);

  if (!usuario || usuario.tipo !== 'ADMINISTRADOR') {
    return null;
  }

  return (
    <div className="p-6">
      {children}
    </div>
  );
}