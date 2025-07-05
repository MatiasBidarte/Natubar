import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { Product } from "../types/product";
import { useUsuarioStore } from "../hooks/useUsuarioStore";

const ProductCard = ({
  product,
  onClick,
}: {
  product: Product;
  onClick?: () => void;
}) => {
  const { usuario, esEmpresa } = useUsuarioStore();

  const precioProducto = usuario
    ? esEmpresa
      ? product.precioEmpresas
      : product.precioPersonas
    : product.precioPersonas;

  return (
    <Card
      sx={{
        width: "100%",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: 0,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
      onClick={onClick}
      elevation={1}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          alt={product.nombre || "Producto"}
          image={product.urlImagen}
          sx={{
            width: "393px",
            height: "250px",
            objectFit: "cover",
          }}
        />
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          gutterBottom
          variant="subtitle1"
          component="div"
          sx={{ fontWeight: 500, lineHeight: 1.2 }}
          noWrap
        >
          {product.nombre}
        </Typography>

        <Box>
          <Typography variant="body1" sx={{ fontWeight: 400 }}>
            ${precioProducto!.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
