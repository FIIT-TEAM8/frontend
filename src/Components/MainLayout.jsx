import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MainRouter from "./MainRouter";
import { DrawerHeader } from "../Style/NavStyledComponents";

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <MainRouter />
      </Box>
    </Box>
  );
}
