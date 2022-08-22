import React from "react";
import CloseIcon from "@icons/CloseIcon";
import Image from ".";
import styled from "@emotion/styled";
import ImageIcon from "@icons/ImageIcon";
import Text from "@base/Text";

interface ImageProps {
  type?: "add" | "delete";
  onDelete?: () => void;
  count?: number;
}

interface Props extends React.ImgHTMLAttributes<HTMLImageElement>, ImageProps {}

const ImageButton: React.FC<Props> = ({ type = "add", count = 0, onClick, ...props }) => {
  if (type === "add") {
    return (
      <StyledImageButton onClick={onClick}>
        <ImageIcon />
        <Text fColor="GRAY1" size="xsm" isBold={true}>
          {count}/10
        </Text>
      </StyledImageButton>
    );
  }

  return (
    <Image size="md" {...props}>
      <StyledCloseIcon onClick={onClick}>
        <CloseIcon />
      </StyledCloseIcon>
    </Image>
  );
};

const StyledImageButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  width: ${({ theme }) => theme.IMAGE_SIZE.md};
  height: ${({ theme }) => theme.IMAGE_SIZE.md};

  background-color: ${({ theme }) => theme.COLOR.OFF_WHITE};
  border: 1px solid ${({ theme }) => theme.COLOR.GRAY3};
  border-radius: 8px;

  gap: 7px;

  & svg path {
    stroke: ${({ theme }) => theme.COLOR.GRAY1};
  }
`;

const StyledCloseIcon = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: ${({ theme }) => theme.COLOR.TITLE_ACTIVE};

  cursor: pointer;

  & svg {
    width: 16px;
    height: 16px;
  }
  & path {
    stroke: ${({ theme }) => theme.COLOR.WHITE};
  }
`;

export default ImageButton;
