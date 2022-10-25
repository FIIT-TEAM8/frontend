import React from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import InfoIcon from "@mui/icons-material/Info";
import { Link } from "react-router-dom";
import { useUser } from "../Utils/UserContext";

function SidebarItem({
  open, text, icon, href = "/"
}) {
  return (
    <Link to={href} style={{ textDecoration: "none" }}>
      <ListItemButton
        color="primary"
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </Link>
  );
}

export default function SidebarItems({ open }) {
  const { user } = useUser();

  return (
    <List>
      <SidebarItem open={open} text="home" icon={<HomeIcon />} href="/search" />
      <SidebarItem
        open={open}
        text="archive"
        icon={<HistoryEduIcon />}
        href="/archive"
      />
      {user && (
        <SidebarItem
          open={open}
          text="pdf report"
          icon={<ArticleIcon />}
          href="/pdf_report"
        />
      )}
      <SidebarItem open={open} text="about" icon={<InfoIcon />} href="/about" />
    </List>
  );
}
