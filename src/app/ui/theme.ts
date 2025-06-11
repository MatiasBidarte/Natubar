// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8B5E3C", // marrón principal
      dark: "#5C3B23",
      light: "#B0885A",
      contrastText: "#fff",
    },
    secondary: {
      main: "#D1B984", // dorado
      contrastText: "#000",
    },
    background: {
      default: "#F9F6F1", // color de fondo claro
      paper: "white",
    },
    text: {
      primary: "#2B2B2B", // texto oscuro
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8B5E3C",
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused:after": {
            borderBottom: "2px solid #8B5E3C",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&:-webkit-autofill": {
            boxShadow: "0 0 0 1000px #d1b984cc inset",
            WebkitTextFillColor: "#2B2B2B",
            transition: "background-color 5000s ease-in-out 0s",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px",
        },
      },
    },
  },
});

export default theme;
