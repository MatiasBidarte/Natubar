import Link from "next/link";
import {
  AccountCircle,
  Home,
  ShoppingBag,
  ShoppingBasket,
  People,
  Inbox,
  BarChart,
  Notifications,
} from "@mui/icons-material";
import { usePathname } from "next/navigation";
import { Typography } from "@mui/material";
import { useUsuarioStore } from "../hooks/useUsuarioStore";

const links = [
  {
    href: "/",
    name: "Inicio",
    icon: Home,
    requireLogin: false,
    mostrarAlAdmin: true,
    mostrarAlUsuario: true,
  },
  {
    href: "/perfil/compras/",
    name: "Mis Compras",
    icon: ShoppingBag,
    requireLogin: true,
    mostrarAlAdmin: false,
    mostrarAlUsuario: true,
  },
  {
    href: "/perfil/",
    name: "Mi Perfil",
    icon: AccountCircle,
    requireLogin: true,
    mostrarAlAdmin: false,
    mostrarAlUsuario: true,
  },
  {
    href: "/admin/",
    icon: AccountCircle,
    requireLogin: true,
    mostrarAlAdmin: true,
    mostrarAlUsuario: false,
  },
  {
    href: "/admin/productos/",
    icon: ShoppingBasket,
    requireLogin: true,
    mostrarAlAdmin: true,
    mostrarAlUsuario: false,
  },
  {
    href: "/admin/listaClientes/",
    icon: People,
    requireLogin: true,
    mostrarAlAdmin: true,
    mostrarAlUsuario: false,
  },
  {
    href: "/admin/listaPedidos/",
    icon: Inbox,
    requireLogin: true,
    mostrarAlAdmin: true,
    mostrarAlUsuario: false,
  },
  {
    href: "/admin/estadisticas/",
    icon: BarChart,
    requireLogin: true,
    mostrarAlAdmin: true,
    mostrarAlUsuario: false,
  },
  {
    href: "/admin/mandarNotificacion/",
    icon: Notifications,
    requireLogin: true,
    mostrarAlAdmin: true,
    mostrarAlUsuario: false,
  },
];

export default function NavLinksMobile() {
  const { estaLogueado, usuario } = useUsuarioStore();
  const pathname = usePathname();
  console.log(pathname);

  const getHref = (link: (typeof links)[number]) =>
    link.requireLogin && !estaLogueado ? "/login" : link.href;

  const getMostrar = (link: (typeof links)[number]) =>
    !estaLogueado || !usuario
      ? link.mostrarAlUsuario
      : (link.mostrarAlUsuario && usuario.tipo != "Administrador") ||
        (link.mostrarAlAdmin && usuario.tipo == "Administrador");

  return (
    <div className="fixed bottom-0 left-0 w-screen md:hidden flex items-center justify-around p-3 bg-[#FFF9ED]">
      {links.map((link) => {
        const IconComponent = link.icon;
        const isActive = pathname === link.href;
        const hrefToUse = getHref(link);
        if (getMostrar(link)) {
          return (
            <Link
              href={hrefToUse}
              key={link.href}
              className="w-1/3 text-center"
            >
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`p-2 w-14 rounded-3xl transition-colors duration-200 ${
                    isActive ? "bg-[#D1B9848F]" : "hover:bg-[#D1B9848F]"
                  }`}
                >
                  <IconComponent className="inline-block" />
                </div>
                <Typography variant="body2" className="mt-1">
                  {link.name}
                </Typography>
              </div>
            </Link>
          );
        }
      })}
    </div>
  );
}
