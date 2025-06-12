import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export default function NumericImput() {
  const [value, setValue] = useState(0);

  const handleIncrease = () => setValue(prev => prev + 1);
  const handleDecrease = () => setValue(prev => (prev > 0 ? prev - 1 : 0));

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: 160,
        height: 50,
        borderRadius: 30,
        border: "2px solid gold",
        bgcolor: "transparent",
        px: 2,
      }}
    >
      <IconButton onClick={handleDecrease} sx={{ color: "gold" }}>
        <RemoveIcon />
      </IconButton>
      <Typography variant="h6" sx={{ color: "gold", fontWeight: "bold" }}>
        {value}
      </Typography>
      <IconButton onClick={handleIncrease} sx={{ color: "gold" }}>
        <AddIcon />
      </IconButton>
    </Box>
  );
}