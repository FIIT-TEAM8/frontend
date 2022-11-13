import React from "react";
import { Box, Typography } from "@mui/material";

export default function TextFlag({ value }) {
  return (
    <Box
      sx={{
        pl: 0.7,
        pr: 0.7,
        borderRadius: 1.5
      }}
      backgroundColor="#e6e7eb"
    >
      <Typography color="secondary">{value}</Typography>
    </Box>
  );
}
