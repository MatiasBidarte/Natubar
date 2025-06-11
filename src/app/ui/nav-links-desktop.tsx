import Link from "next/link";
import { usePathname } from "next/navigation";
import { Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import Image from "next/image";

const links = [
  {
    href: "/",
    name: "Inicio",
    type: "text",
  },
  {
    href: "/perfil/compras",
    name: "Mis Compras",
    type: "text",
  },
  {
    href: "/perfil",
    name: "Mi Perfil",
    type: "icon",
  },
];

export default function NavLinksDesktop({
  estaLogueado = false,
}: {
  estaLogueado?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center justify-between p-4 bg-[#201B21] text-[#B99342]">
      {/* Espacio vacío a la izquierda para equilibrar */}
      <div className="w-12"></div>

      {/* Grupo central: Inicio, Logo, Mis Compras */}
      <div className="flex-grow flex items-center justify-center gap-16">
        {/* Inicio */}
        <Link href={links[0].href} className="inline-block">
          <Typography
            variant="body1"
            className={`relative transition-colors duration-200
              ${
                pathname === links[0].href
                  ? "text-amber-300 after:bg-amber-300 after:h-0.5"
                  : "hover:text-amber-200 after:bg-amber-200 hover:after:h-0.5 after:h-0"
              }
              after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:transition-all`}
          >
            {links[0].name}
          </Typography>
        </Link>

        {/* Logo */}
        <div className="flex justify-center">
          <Image
            width={106}
            height={74}
            src="/icon512_rounded.png"
            alt="Natubar"
          />
        </div>

        {/* Mis Compras */}
        <Link
          href={estaLogueado ? links[1].href : "/login"}
          className="inline-block"
        >
          <Typography
            variant="body1"
            className={`relative transition-colors duration-200
              ${
                pathname === links[1].href
                  ? "text-amber-300 after:bg-amber-300 after:h-0.5"
                  : "hover:text-amber-200 after:bg-amber-200 hover:after:h-0.5 after:h-0"
              }
              after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:transition-all`}
          >
            {links[1].name}
          </Typography>
        </Link>
      </div>

      {/* Perfil (extremo derecho pero más a la izquierda) */}
      <div className="flex items-center mr-8">
        <Link href={estaLogueado ? links[2].href : "/login"}>
          <AccountCircle
            className={`transition-colors duration-200
              ${
                pathname === links[2].href
                  ? "text-amber-300"
                  : "hover:text-amber-200"
              }`}
          />
        </Link>
      </div>
    </div>
  );
}
