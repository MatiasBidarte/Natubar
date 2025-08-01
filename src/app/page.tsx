"use client";
import {
  alpha,
  Skeleton,
  Stack,
  InputBase,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ProductCard from "./components/card";
import { Producto } from "./types/producto";
import { useEffect, useState } from "react";
import { homemadeApple } from "./ui/fonts";
import ModalCard from "./components/modalCard";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import useProductos from "./hooks/useProductos";
import BotonCarrito from "./components/IconCarrito";
import { usePedidos } from "./hooks/usePedidos";

interface ModalCard {
  open: boolean;
  handleClose: () => void;
  producto: Producto;
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));



export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { products, fetchProducts, loading, error } = useProductos() as {
    products: Producto[];
    loading: boolean;
    error: string | null;
    fetchProducts: () => void;
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [search, setSearch] = useState<string>("");

  const filteredProducts = products.filter((producto) =>
    producto.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  const { items } = usePedidos();

  const handleOpen = (producto: Producto): void => {
    setSelectedProduct(producto);
    setOpen(true);
  };

  const handleClose = (): void => setOpen(false);

  return (
    <div className=" md:border-amber-600">
      <div className="portada flex items-center justify-center">
        <div className="text-center">
          <Typography
            variant={isMobile ? "h4" : "h2"}
            fontFamily={homemadeApple.style.fontFamily}
            gutterBottom
          >
            La felicidad en barra
          </Typography>
          <Typography variant={isMobile ? "h5" : "h3"} fontWeight={300}>
            NatuBar Barras Artesanales
          </Typography>
        </div>
      </div>
      <Box
        height={"151px"}
        display="flex"
        flexDirection={"column"}
        alignItems="center"
        justifyContent="center"
        bgcolor={theme.palette.secondary.main}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight={300}
          textAlign="center"
        >
          AHORA PODÉS HACER
        </Typography>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontFamily={homemadeApple.style.fontFamily}
          textAlign="center"
        >
          tu pedido más rápido y fácil
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" my={2}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            aria-label="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Search>
      </Box>
      <Stack
        spacing={{ xs: 1, sm: 2 }}
        direction="row"
        useFlexGap
        sx={{ flexWrap: "wrap", justifyContent: "center" }}
      >
        {loading ? (
          <>
            <Skeleton
              sx={{ bgcolor: "grey.900" }}
              variant="rounded"
              width={313.021}
              height={400}
            />
            <Skeleton
              sx={{ bgcolor: "grey.900" }}
              variant="rounded"
              width={313.021}
              height={400}
            />
            <Skeleton
              sx={{ bgcolor: "grey.900" }}
              variant="rounded"
              width={313.021}
              height={400}
            />
          </>
        ) : error ? (
          <p>Error: {error}</p>
        ) : filteredProducts.length === 0 ? (
          <p>No se encontraron productos</p>
        ) : (
          filteredProducts.map((producto) => (
            <div key={producto.id} onClick={() => handleOpen(producto)}>
              <ProductCard product={producto} />
            </div>
          ))
        )}
        {selectedProduct && (
          <ModalCard
            open={open}
            handleClose={handleClose}
            producto={selectedProduct}
          />
        )}
      </Stack>
      <BotonCarrito cantidad={items.length} />
    </div>
  );
}
