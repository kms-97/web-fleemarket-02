import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@emotion/react";
import GlobalStyle from "@theme/GlobalStyle";

import App from "./App";
import { theme } from "./theme";
import { BrowserRouter } from "react-router-dom";
import { CacheProvider } from "@contexts/CacheContext";
import { ToastProvider } from "@contexts/ToastMessageContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CacheProvider>
        <ToastProvider>
          <GlobalStyle theme={theme} />
          <App />
        </ToastProvider>
      </CacheProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
