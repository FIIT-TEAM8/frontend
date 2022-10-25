import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MainRouter from "./MainRouter";
import MainNavigation from "./MainNavigation";
import { DrawerHeader } from "../Style/NavStyledComponents";

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <MainNavigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <MainRouter />
      </Box>
    </Box>
  );
}
