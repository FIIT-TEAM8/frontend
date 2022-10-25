import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface Props {
  text: string;
  open: boolean;
  severity: AlertColor;
  handleClose: () => void;
}

export default function InfoSnackbar({
  text,
  open,
  severity,
  handleClose,
}: Props) {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={handleClose}
      autoHideDuration={3000}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {text}
      </Alert>
    </Snackbar>
  );
}
