const COLOR = {
  PRIMARY1: "#2AC1BC",
  PRIMARY2: "#A0E1E0",
  PRIMARY3: "#219A95",

  GRAY1: "#888888",
  GRAY2: "#BBBBBB",
  GRAY3: "#D7D7D7",

  TITLE_ACTIVE: "#222222",
  ERROR: "#F45452",
  BACKGROUND: "#F6F6F6",
  OFF_WHITE: "#FDFDFD",
  WHITE: "#FFFFFF",
};

const FONT_SIZE = {
  lg: "18px",
  md: "16px",
  sm: "14px",
  xsm: "12px",
};

const IMAGE_SIZE = {
  gd: "100%",
  lg: "106px",
  md: "76px",
  sm: "40px",
};

export const theme = {
  BACKGROUND_COLOR: "#f5f5f5",
  COLOR,
  FONT_SIZE,
  IMAGE_SIZE,
};

export type ImageSizeType = keyof typeof IMAGE_SIZE;
export type FontSizeType = keyof typeof FONT_SIZE;
export type ColorType = keyof typeof COLOR;
export type ThemeType = typeof theme;
