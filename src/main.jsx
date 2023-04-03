import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import LoginContextProvider from "./contexts/LoginContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoginContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LoginContextProvider>
  </React.StrictMode>
);
