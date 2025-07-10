import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ThemeToggle = ({ mode, toggleTheme }) => (
  <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
    <IconButton onClick={toggleTheme} color="inherit" size="large">
      {mode === "light" ? (
        <LightModeIcon
          sx={{ color: mode === "light" ? "primary.main" : "inherit" }}
        />
      ) : (
        <DarkModeIcon
          sx={{ color: mode === "dark" ? "primary.main" : "inherit" }}
        />
      )}
    </IconButton>
  </Tooltip>
);

export default ThemeToggle;
