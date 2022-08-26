import React from "react";
import { ImageSizeType } from "@theme/.";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

interface ImageProps {
  size: ImageSizeType;
}

interface Props extends React.ImgHTMLAttributes<HTMLImageElement>, ImageProps {}

const Image: React.FC<Props> = ({ children, size, ...props }) => {
  return (
    <StyledImage size={size}>
      {size === "gd" && <div className="gradient" />}
      {props.src && <img alt="image" {...props} />}
      {children}
    </StyledImage>
  );
};

const StyledImage = styled.div<ImageProps>`
  position: relative;

  width: ${({ theme, size }) => theme.IMAGE_SIZE[size]};
  aspect-ratio: 1 / 1;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  & > img {
    width: 100%;
    height: 100%;
    ${({ theme, size }) =>
      size !== "gd" &&
      css`
        border: 1px solid ${theme.COLOR.GRAY3};
        border-radius: 8px;
      `}
    background-color: ${({ theme }) => theme.COLOR.OFF_WHITE};
    object-fit: cover;
  }

  & > .gradient {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    position: absolute;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.24) 0%,
      rgba(0, 0, 0, 0) 20%,
      rgba(0, 0, 0, 0) 80%,
      rgba(0, 0, 0, 0.24) 100%
    );
  }
`;

export default Image;
