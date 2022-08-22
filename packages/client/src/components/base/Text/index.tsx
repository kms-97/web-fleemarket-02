import React from "react";
import styled from "@emotion/styled";
import { ColorType, FontSizeType } from "@theme/.";

interface TextProps {
  size: FontSizeType;
  fColor: ColorType;
  isBold: boolean;
}

interface Props extends React.ParamHTMLAttributes<HTMLParagraphElement>, Partial<TextProps> {}

const Text: React.FC<Props> = ({
  children,
  isBold = false,
  fColor = "TITLE_ACTIVE",
  size = "md",
  ...props
}) => {
  return (
    <StyledText isBold={isBold} fColor={fColor} size={size} {...props}>
      {children}
    </StyledText>
  );
};

const StyledText = styled.p<TextProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme, fColor }) => theme.COLOR[fColor]};
  font-size: ${({ theme, size }) => theme.FONT_SIZE[size]};
  font-weight: ${({ isBold }) => (isBold ? "500" : "normal")};
  vertical-align: middle;

  transition: color 0.2s;
`;

export default Text;
