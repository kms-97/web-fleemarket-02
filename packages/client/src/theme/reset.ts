import { css } from "@emotion/react";

export const reset = css`
  html,
  body,
  div,
  span,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  a,
  q,
  strong,
  ol,
  ul,
  li,
  form,
  label,
  article,
  footer,
  header,
  nav,
  section {
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
  }

  body {
    /* line-height: 1; */
  }

  ol,
  ul {
    list-style: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
    outline: none;
  }

  input,
  textarea,
  button {
    border: 0;
    padding: 0;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    border-radius: 0;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    background: none;
  }

  button {
    cursor: pointer;
  }
`;
