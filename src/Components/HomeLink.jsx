import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

export default function HomeLink({ variant = "h1" }) {
  return (
    <Link to="/search" style={{ textDecoration: "none" }}>
      <Typography variant={variant} color="primary">
        adversea
      </Typography>
    </Link>
  );
}
