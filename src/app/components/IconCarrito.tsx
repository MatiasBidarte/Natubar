import { ShoppingCart } from "@mui/icons-material";
import { IconButton, Badge } from "@mui/material";
import Link from "next/link";
import React from "react";

interface CantidadDeItems {
  cantidad?: number;
}

const BotonCarrito: React.FC<CantidadDeItems> = ({cantidad}) => {
  return (
    <div className="fixed md:hidden bottom-25  right-8 z-[1000]">
      <Link href="/carrito" passHref>
        <IconButton
          aria-label="Carrito de compras"
          sx={{
            backgroundColor: "#B99342",
            color: "white",
            "&:hover": { backgroundColor: "#A57C2E" },
            boxShadow: 6,
            padding: "16px",
            transition: "transform 0.2s",
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          <Badge
            badgeContent={cantidad}
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
            <ShoppingCart fontSize="large" />
          </Badge>
        </IconButton>
      </Link>
    </div>
  );
};

export default BotonCarrito;