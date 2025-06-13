import { Box, IconButton, Typography } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import theme from "../ui/theme";


interface NumericInputProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function NumericImput({ value, onChange }: NumericInputProps) {
  const handleIncrease = () => onChange({ 
    target: { value: String(Number(value) + 1) } 
  } as React.ChangeEvent<HTMLInputElement>);
  const handleDecrease = () => onChange({ 
    target: { value: String(Math.max(Number(value) - 1, 0)) } 
  } as React.ChangeEvent<HTMLInputElement>);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: 160,
        height: 50,
        borderRadius: 30,
        border: `2px solid ${theme.palette.secondary.main}`,
        bgcolor: "transparent",
        px: 2,
      }}
    >
      <IconButton onClick={handleDecrease} >
        <RemoveIcon />
      </IconButton>
      <Typography variant="h6" >
        {value}
      </Typography>
      <IconButton onClick={handleIncrease}>
        <AddIcon />
      </IconButton>
    </Box>
  );
}