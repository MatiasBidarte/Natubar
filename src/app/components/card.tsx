import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Product } from "../types/product";

const ProductCard = ({ product }: {product: Product}) => {

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
    </Card>
  
);
};

export default ProductCard;