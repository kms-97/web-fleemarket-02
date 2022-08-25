import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@emotion/react";
import GlobalStyle from "@theme/GlobalStyle";

import App from "./App";
import { theme } from "./theme";
import { BrowserRouter } from "react-router-dom";
import { CacheProvider } from "@contexts/CacheContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CacheProvider>
        <GlobalStyle theme={theme} />
        <App />
      </CacheProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
