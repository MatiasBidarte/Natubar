'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Typography, Badge } from "@mui/material";
import { AccountCircle, ShoppingCart } from "@mui/icons-material";
import Image from "next/image";
import { useUsuarioStore } from "../hooks/useUsuarioStore";
import { usePedidos } from "../hooks/usePedidos";
import { useEffect } from "react";

const links = [
  { href: "/", name: "Inicio", type: "text", requireLogin: false, mostrarAlAdmin: true, mostrarAlUsuario: true, columnaIzq: true },
  { href: "/perfil/compras/", name: "Mis Compras", type: "text", requireLogin: true, mostrarAlAdmin: false, mostrarAlUsuario: true, columnaIzq: false },
  { href: "/admin/", name: "Admin", type: "text", requireLogin: true, mostrarAlAdmin: true, mostrarAlUsuario: false, columnaIzq: false },
];

export default function NavLinksDesktop() {
  const { estaLogueado, usuario } = useUsuarioStore();
  const { items } = usePedidos();
  const pathname = usePathname();
  
  //const [reload, setReload] = useState(0);

  useEffect(() => {
    //setReload((prev) => prev + 1);
  }, [usuario]);
  
  const getHref = (link: typeof links[number]) =>
    link.requireLogin && !estaLogueado ? "/login" : link.href;

  const isActive = (href: string) => pathname === href;

  const getMostrar = (link: typeof links[number]) =>
    (!estaLogueado || !usuario) ? link.mostrarAlUsuario : (link.mostrarAlUsuario && usuario.tipo != "ADMINISTRADOR" || link.mostrarAlAdmin && usuario.tipo == "ADMINISTRADOR")

  return (
    <div className={`z-[1000] fixed hidden md:flex ${!usuario || usuario.tipo != "ADMINISTRADOR" ? "mt-11" : ""} items-center justify-between bg-[#201B21] text-[#B99342] w-screen`}>
      <div className={`w-32${!(!usuario || usuario.tipo != "ADMINISTRADOR") ? "hidden" : ""}`} />

      <div className="flex-grow flex items-center justify-center gap-16">
        {links
          .filter((link) => link.type === "text" && getMostrar(link) && link.columnaIzq)
          .map((link) => (
            <Link key={link.name} href={getHref(link)} className="inline-block">
              <Typography
                variant="body1"
                className={`relative transition-colors duration-200
                  ${
                    isActive(link.href)
                      ? "text-amber-300 after:bg-amber-300 after:h-0.5"
                      : "hover:text-amber-200 after:bg-amber-200 hover:after:h-0.5 after:h-0"
                  }
                  after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:transition-all`}
              >
                {link.name}
              </Typography>
            </Link>
          ))}

        <div className="flex justify-center">
          <Image
            width={76}
            height={76}
            src="/icon512_rounded.png"
            alt="Natubar"
          />
        </div>


        {links
          .filter((link) => link.type === "text" && getMostrar(link) && !link.columnaIzq)
          .map((link) => (
            <Link key={link.name} href={getHref(link)} className="inline-block">
              <Typography
                variant="body1"
                className={`relative transition-colors duration-200
                  ${
                    isActive(link.href)
                      ? "text-amber-300 after:bg-amber-300 after:h-0.5"
                      : "hover:text-amber-200 after:bg-amber-200 hover:after:h-0.5 after:h-0"
                  }
                  after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:transition-all`}
              >
                {link.name}
              </Typography>
            </Link>
          ))}
      </div>

      <div className={`flex items-center mr-8 ${!(!usuario || usuario.tipo != "ADMINISTRADOR") ? "hidden" : ""}`}>
        <Link href={!estaLogueado ? "/login" : "/perfil/"}>
          <AccountCircle
            className={`transition-colors duration-200 ${
                pathname === "/perfil" ? "text-amber-300" : "hover:text-amber-200"
              }`}
          />
        </Link>
      </div>
      <div className={`flex items-center mr-8 ${!(!usuario || usuario.tipo != "ADMINISTRADOR") ? "hidden" : ""}`}>
        <Link href="/carrito">
          <Badge
            badgeContent={items.length}
            color="error"
            overlap="circular"
            sx={{
              "& .MuiBadge-badge": {
                right: -4,
                top: -4,
                border: "2px solid white",
              },
            }}
          >
            <ShoppingCart
              className={`transition-colors duration-200 ${
                pathname === "/carrito" ? "text-amber-300" : "hover:text-amber-200"
              }`}
            />
          </Badge>
        </Link>
      </div>
    </div>
  );
}