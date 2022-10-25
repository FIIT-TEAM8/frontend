import React from "react";
import ReactDOM from "react-dom";
import "./Style/index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  root
);
