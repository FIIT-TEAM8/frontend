import { createTheme } from "@mui/material/styles";
import { teal, grey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: teal[500],
      light: teal[50],
      dark: teal[900],
    },
    secondary: {
      main: grey[600],
      light: grey[100],
      dark: grey[900],
    },
    neutral: {
      main: "#fff",
    },
  },
  typography: {
    fontSize: 12,
    h2: {
      fontSize: "1.5rem",
    },
    h3: {
      fontSize: "1.2rem",
    },
  },
});

export default theme;
