import { Typography } from "@mui/material";
import React from "react";
import theme from "../Style/Theme";

export default function MainHeading({ text }) {
  const splitText = text.split(" ");

  const colors = theme.palette;
  const mainColor = splitText.length > 1 ? "secondary" : "primary";

  const firstWord = splitText[0];
  splitText.shift();

  return (
    <Typography
      sx={{ lineHeight: "3.5rem", letterSpacing: ".4rem" }}
      component="h1"
      fontSize="4rem"
      color={mainColor}
    >
      <span>{firstWord}</span>
      {" "}
      <span style={{ color: colors.primary.main }}>{splitText.join(" ")}</span>
    </Typography>
  );
}
