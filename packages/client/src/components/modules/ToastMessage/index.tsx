import React, { useEffect, useRef } from "react";
import { useToastMessage, useToastMessageAction } from "@contexts/ToastMessageContext";
import styled from "@emotion/styled";
import Text from "@base/Text";

const ToastMessage = () => {
  const messageRef = useRef(null);
  const { message, type, isVisible } = useToastMessage();
  const { deleteToastMessage } = useToastMessageAction();

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        if (isVisible) deleteToastMessage();
      }, 2000);
    }
  }, [message, isVisible]);

  const onClickMessage = () => {
    deleteToastMessage();
  };

  return (
    <StyledToastMessage ref={messageRef} isVisible={isVisible} type={type} onClick={onClickMessage}>
      <Text fColor={type === "error" ? "ERROR" : "TITLE_ACTIVE"}>{message}</Text>
    </StyledToastMessage>
  );
};

const StyledToastMessage = styled.div<{ type: "notice" | "error"; isVisible: boolean }>`
  position: fixed;
  bottom: -500px;
  left: 50%;
  right: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  transition: bottom 0.5s;

  align-items: center;
  word-wrap: break-word;

  width: 90%;
  max-width: 480px;
  background-color: ${({ theme }) => theme.COLOR.OFF_WHITE};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1), 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;

  & > p {
    justify-content: flex-start;
  }

  ${({ isVisible }) => isVisible && "bottom: 16px"}
`;

export default ToastMessage;
