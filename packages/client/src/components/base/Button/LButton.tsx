import Text from "@base/Text";
import styled from "@emotion/styled";
import CloseIcon from "@icons/CloseIcon";
import PlusIcon from "@icons/PlusIcon";
import React from "react";

interface ILocation {
  name: string;
  isActive: boolean;
}

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  location?: ILocation;
  onDelete?: any;
}

const LButton: React.FC<Props> = ({ location, onDelete, ...props }) => {
  if (location) {
    const { isActive, name } = location;
    return (
      <StyledButton location={location} {...props}>
        <Text size="sm" isBold={true} fColor={isActive ? "OFF_WHITE" : "PRIMARY1"}>
          {name}
        </Text>
        <CloseIcon onClick={onDelete} />
      </StyledButton>
    );
  }
  return (
    <StyledButton {...props}>
      <PlusIcon />
    </StyledButton>
  );
};

const StyledButton = styled.button<{ location?: ILocation }>`
  min-width: 136px;

  display: flex;
  align-items: center;
  justify-content: ${({ location }) => (location ? "space-between" : "center")};
  background-color: ${({ theme, location }) =>
    location?.isActive ? theme.COLOR.PRIMARY1 : theme.COLOR.WHITE};

  border: ${({ theme, location }) => !location?.isActive && `1px solid ${theme.COLOR.PRIMARY1}`};

  border-radius: 8px;
  padding: 6px 16px;

  & svg,
  & path {
    transition: stroke 0.2s;
    stroke: ${({ theme }) => theme.COLOR.PRIMARY2};
  }
`;

export default LButton;
