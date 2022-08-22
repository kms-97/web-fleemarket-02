import React from "react";
import { Global, css } from "@emotion/react";
import { ThemeType } from ".";
import { reset } from "./reset";

interface Props {
  theme: ThemeType;
}

const GlobalStyle = ({ theme }: Props) => {
  return (
    <Global
      styles={css`
        ${reset}

        html {
          font-size: 16px;
          background-color: ${theme.BACKGROUND_COLOR};
        }

        body,
        #root {
          width: 100%;
          height: 100%;
        }

        body {
          margin: 0;
        }

        * {
          box-sizing: border-box;
        }
      `}
    />
  );
};

export default GlobalStyle;
