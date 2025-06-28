import Link from "next/link";
import { AccountCircle, Home, ShoppingBag } from "@mui/icons-material";
import { usePathname } from "next/navigation";
import { Typography } from "@mui/material";
import { useUsuarioStore } from "../hooks/useUsuarioStore";



const links = [
  {
    href: "/",
    name: "Inicio",
    icon: Home,
  },
  {
    href: "/perfil/compras/",
    name: "Mis Compras",
    icon: ShoppingBag,
  },
  {
    href: "/perfil/",
    name: "Mi Perfil",
    icon: AccountCircle,
  },
];

export default function NavLinksMobile() {
  const { estaLogueado } = useUsuarioStore();
  const pathname = usePathname();
  
  return (
    <div className="fixed bottom-0 left-0 w-screen md:hidden flex items-center justify-around p-3 bg-[#FFF9ED]">
      {links.map((link, index) => {
        const IconComponent = link.icon;
        const isActive = pathname === link.href;
        const hrefToUse = estaLogueado || index === 0 ? link.href : "/login";

        return (
          <Link href={hrefToUse} key={link.href} className="w-1/3 text-center">
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
      })}
    
    </div>
  );
}
