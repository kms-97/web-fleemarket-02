import React, { MouseEventHandler } from "react";
import Button from "@base/Button";
import Text from "@base/Text";
import styled from "@emotion/styled";
import ModalPortal from "./ModalPortal";

interface Props {
  dong: string;
  onClose: () => void;
  deleteLocation: MouseEventHandler;
}

const DeleteLocationModal = ({ dong, onClose, deleteLocation }: Props) => {
  return (
    <ModalPortal>
      <Background>
        <Container>
          <Text size="lg">{dong}을 삭제하시겠습니까?</Text>
          <Buttons>
            <Button onClick={onClose}>취소</Button>
            <Button className="delete" onClick={deleteLocation}>
              삭제
            </Button>
          </Buttons>
        </Container>
      </Background>
    </ModalPortal>
  );
};

const Background = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  z-index: 100;

  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background-color: ${({ theme }) => theme.COLOR.GRAY1};
  opacity: 0.8;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 16px;

  background-color: ${({ theme }) => theme.COLOR.OFF_WHITE};
  border-radius: 8px;
  padding: 20px 28px;

  > p {
    font-size: 20px;
  }
`;

const Buttons = styled.div`
  display: flex;
  column-gap: 16px;

  .delete {
    background-color: ${({ theme }) => theme.COLOR.ERROR};
    border: ${({ theme }) => theme.COLOR.ERROR};
    transition: filter 0.2s;

    &:hover {
      filter: brightness(0.75);
    }
    &:focus {
      filter: brightness(0.75);
    }
  }
`;

export default DeleteLocationModal;
