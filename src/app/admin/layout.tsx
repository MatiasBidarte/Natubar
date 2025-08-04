"use client";
import { useUsuarioStore } from "../hooks/useUsuarioStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { usuario, inicializado, esAdmin } = useUsuarioStore();
  const router = useRouter();
  useEffect(() => {
    if (inicializado && (!usuario || !esAdmin)) {
      router.push("/");
    }
  }, [usuario, inicializado, router, esAdmin]);

  if (!usuario || !esAdmin) {
    return null;
  }

  return <div className="w-screen">{children}</div>;
}
