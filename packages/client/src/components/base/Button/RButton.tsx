import React from "react";
import styled from "@emotion/styled";

interface Props {
  name: string;
  value: string;
}

const Radio: React.FC<Props> = ({ name, value }) => {
  return (
    <>
      <Input type="radio" id={value} value={value} name={name} />
      <Label htmlFor={value}>{value}</Label>
    </>
  );
};

const Label = styled.label`
  display: flex;
  padding: 4px 16px;

  align-items: center;
  justify-content: center;

  border: 1px solid ${({ theme }) => theme.COLOR.PRIMARY1};
  border-radius: 999px;
`;

const Input = styled.input`
  display: none;

  &:checked + label {
    background-color: ${({ theme }) => theme.COLOR.PRIMARY1};
    color: ${({ theme }) => theme.COLOR.WHITE};
  }
`;

export default Radio;
