import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import theme from "./Style/Theme";
import UserProvider from "./Utils/UserProvider";
import MainLayout from "./Components/MainLayout";

function App() {
  return (
    <div className="App" style={{ maxWidth: "1920px", margin: "auto" }}>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <MainLayout />
        </ThemeProvider>
      </UserProvider>
    </div>
  );
}

export default App;
