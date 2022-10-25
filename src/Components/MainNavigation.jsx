// @ts-nocheck
import React from "react";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import { SwipeableDrawer } from "@mui/material";
import MainBar from "./MainBar";
import {
  DesktopDrawer, AppBar, DrawerHeader, drawerWidth
} from "../Style/NavStyledComponents";
import HomeLink from "./HomeLink";
import useWindowSize from "../Utils/Screen";
import SidebarItems from "./SidebarItems";

// SOURCE (MUI DOCS):
// https://mui.com/components/drawers/#MiniDrawer.js

export function Topbar({ open, handleDrawerToggle }) {
  const { width } = useWindowSize();
  const isMobile = width && width < 768;

  return (
    <AppBar position="fixed" open={!isMobile && open} color="neutral">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{
            marginRight: 5,
            ...(!isMobile && open && { display: "none" })
          }}
        >
          <MenuIcon />
        </IconButton>
        <div style={{ marginLeft: "auto" }}>
          <MainBar />
        </div>
      </Toolbar>
    </AppBar>
  );
}

export function Sidebar({
  children, open, handleDrawerClose, handleDrawerOpen
}) {
  const theme = useTheme();
  const { width } = useWindowSize();
  const isMobile = width && width < 768;

  let DrawerComponent = DesktopDrawer;
  let drawerVariant = "permanent";
  let onClickAway = () => {};
  if (isMobile) {
    DrawerComponent = SwipeableDrawer;
    drawerVariant = "temporary";
    onClickAway = handleDrawerClose;
  }

  return (
    <DrawerComponent
      variant={drawerVariant}
      open={open}
      onOpen={handleDrawerOpen}
      onClose={onClickAway}
      hysterisis={0.25}
      swipeAreaWidth={40}
      ModalProps={{
        keepMounted: true
      }}
    >
      <DrawerHeader style={{ minWidth: `${drawerWidth}px` }}>
        <Box sx={{ pl: 1.5 }}>
          <HomeLink variant="h4" />
        </Box>
        <IconButton onClick={handleDrawerClose} style={{ marginLeft: "auto" }}>
          {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      {children}
    </DrawerComponent>
  );
}

export default function MainNavigation() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setIsOpen(true);
  };

  const handleDrawerClose = () => {
    setIsOpen(false);
  };

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Topbar
        open={isOpen}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Sidebar
        open={isOpen}
        handleDrawerClose={handleDrawerClose}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerToggle={handleDrawerToggle}
      >
        <SidebarItems open={isOpen} />
      </Sidebar>
    </>
  );
}
