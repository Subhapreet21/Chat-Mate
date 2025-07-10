import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // palette values for light mode
            background: {
              default: "#f4f6fb",
              paper: "#fff",
            },
            primary: {
              main: "#1976d2",
            },
            secondary: {
              main: "#9c27b0",
            },
          }
        : {
            // palette values for dark mode
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
            primary: {
              main: "#90caf9",
            },
            secondary: {
              main: "#ce93d8",
            },
          }),
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
    },
  });
