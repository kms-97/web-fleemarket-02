import React from "react";
import styled from "@emotion/styled";
import Input from "@base/Input";
import SendIcon from "@icons/SendIcon";

interface Props {
  value: string;
  onChange: React.ChangeEventHandler;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ChatDetailFooter = ({ value, onChange, onSubmit }: Props) => {
  return (
    <Form onSubmit={onSubmit}>
      <Input value={value} onChange={onChange} />
      <button>
        <SendIcon />
      </button>
    </Form>
  );
};

const Form = styled.form`
  position: sticky;
  bottom: 0;

  width: 100%;
  padding: 8px;
  gap: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLOR.OFF_WHITE};
  box-shadow: inset 0px 1px 0px ${({ theme }) => theme.COLOR.GRAY3};

  & > button {
    display: flex;
  }
`;

export default ChatDetailFooter;
