import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import IconCarrito from "./IconCarrito";
import { Product } from "../types/product";
import { useRouter } from "next/navigation";

const ProductCard = ({ product }: {product: Product}) => {
    const router = useRouter();
    const handleClick = (id: number) => {
      router.push(`/detalleProducto/${id}`);
    };
  return (
<Card sx={{ maxWidth: 345 }} className= "text-3xl ">
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={product.urlImagen}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.nombre}
        </Typography>
      </CardContent>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          ${product.precioPersonas}
      </Typography>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            if (product.id !== undefined) {
              handleClick(product.id);
            }
          }}
        >
            <IconCarrito/>
            Agregar al carrito
        </Button>
      </CardActions>
    </Card>
  
);
};

export default ProductCard;