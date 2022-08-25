import React, { memo, useCallback, useState } from "react";
import Input, { Props as InputProps } from "@base/Input";
import Text from "@base/Text";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

type ValidType = <T extends string>(value: T) => string;

interface Props extends InputProps {
  message?: string | null;
  validator?: ValidType;
  children?: React.ReactNode;
}

const InputBox = ({
  children,
  defaultValue,
  onChange,
  validator,
  message = null,
  ...props
}: Props) => {
  const [error, setError] = useState<string | null>(message);

  const onBlur: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (!validator) {
        return;
      }

      const value = e.target.value;

      const errorMessage = validator(value);

      if (errorMessage.length) {
        setError(errorMessage);
      }
      if (!errorMessage && error) {
        setError(null);
      }
    },
    [validator, error],
  );

  return (
    <StyledInputBox isError={Boolean(error)}>
      {children}
      <Input
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={validator ? onBlur : undefined}
        {...props}
      />
      {error && (
        <Text size="xsm" fColor="ERROR">
          {error}
        </Text>
      )}
    </StyledInputBox>
  );
};

const StyledInputBox = styled.section<{ isError: boolean }>`
  width: 100%;

  display: flex;
  align-items: flex-start;
  flex-direction: column;

  row-gap: 10px;

  & > p {
    padding-left: 5px;
  }

  ${({ isError, theme }) =>
    isError &&
    css`
      & > input {
        border-color: ${theme.COLOR.ERROR} !important;
      }
    `}
`;

export default InputBox;
