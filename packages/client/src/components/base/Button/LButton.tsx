import Text from "@base/Text";
import styled from "@emotion/styled";
import { useModal } from "@hooks/useModal";
import CloseIcon from "@icons/CloseIcon";
import PlusIcon from "@icons/PlusIcon";
import DeleteLocationModal from "@modals/DeleteLocationModal";
import React, { MouseEventHandler } from "react";
import { IUserLocation } from "types/location.type";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  location?: IUserLocation;
  onDelete?: (locationId: number) => void;
}

const LButton: React.FC<Props> = ({ location, onDelete, ...props }) => {
  if (location) {
    const [isOpen, openModal, closeModal] = useModal();
    const { isActive, dong } = location;

    const onClickCloseIcon: MouseEventHandler = (e) => {
      e.stopPropagation();
      openModal();
    };

    const onDeleteLocation = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete?.(location?.id);
    };

    return (
      <>
        <StyledButton location={location} {...props}>
          <Text size="sm" isBold={true} fColor={isActive ? "OFF_WHITE" : "PRIMARY1"}>
            {dong}
          </Text>
          <CloseIcon onClick={onClickCloseIcon} />
        </StyledButton>
        {isOpen && (
          <DeleteLocationModal dong={dong} onClose={closeModal} deleteLocation={onDeleteLocation} />
        )}
      </>
    );
  }
  return (
    <StyledButton {...props}>
      <PlusIcon />
    </StyledButton>
  );
};

const StyledButton = styled.button<{ location?: IUserLocation }>`
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
    z-index: 1;
    transition: stroke 0.2s;
    stroke: ${({ theme }) => theme.COLOR.PRIMARY2};
  }
`;

export default LButton;
