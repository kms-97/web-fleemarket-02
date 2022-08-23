import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@emotion/react";
import GlobalStyle from "@theme/GlobalStyle";

import reportWebVitals from "./reportWebVitals";

import App from "./App";
import { theme } from "./theme";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyle theme={theme} />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

reportWebVitals();
