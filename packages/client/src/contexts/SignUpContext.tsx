import React, { useRef } from "react";
import { createContext, useContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

interface FormDataProps {
  value: string;
  isValid: boolean;
  validate: null | any;
}

interface SignUpFormProps {
  userId: FormDataProps;
  password: FormDataProps;
  confirmPassword: FormDataProps;
}

interface ActionProps {
  handler: (e: React.ChangeEvent<HTMLInputElement>, validate?: any) => void;
}

interface SignUpFormState {
  data: SignUpFormProps;
  isValid: boolean;
}

const initialFormState = {
  userId: {
    value: "",
    isValid: false,
    validate: null,
  },
  password: {
    value: "",
    isValid: false,
    validate: null,
  },
  confirmPassword: {
    value: "",
    isValid: false,
    validate: null,
  },
};

const initialActionState = {
  handler: (e: React.ChangeEvent<HTMLInputElement>, validate?: any) => {
    return;
  },
};

export const SignUpFormContext = createContext<SignUpFormState | null>(null);
export const SignUpFormActionContext = createContext<ActionProps | null>(null);

export const useSignUpFormContext = () => useContext(SignUpFormContext);
export const useSignUpFormActionContext = () => useContext(SignUpFormActionContext);

export const SignUpFormProvider = ({ children }: Props) => {
  const state = useRef<SignUpFormProps>(initialFormState);
  const [isValid, setIsValid] = useState(false);

  const handler = (e: React.ChangeEvent<HTMLInputElement>, validate?: any) => {
    const value = e.target.value;
    const name = e.target.name as keyof Omit<SignUpFormProps, "isValid">;

    state.current[name].value = value;

    if (value === "") {
      state.current[name].isValid = false;
      setIsValid(false);
      return;
    }

    if (!validate) {
      return;
    }

    state.current[name].validate = validate;

    const checkIsAllValid = checkAllValid();

    setIsValid(checkIsAllValid);
  };

  const checkAllValid = () => {
    const values = Object.values(state.current) as FormDataProps[];

    return values.every(({ value, validate }) => {
      if (!validate) {
        return false;
      }
      return Boolean(!validate(value));
    });
  };

  initialActionState.handler = handler;

  const formState = { data: state.current, isValid };
  const action = { handler };

  return (
    <SignUpFormActionContext.Provider value={action}>
      <SignUpFormContext.Provider value={formState}>{children}</SignUpFormContext.Provider>
    </SignUpFormActionContext.Provider>
  );
};

export const useSignUpForm = () => {
  const value = useSignUpFormContext();

  if (!value) {
    return { data: initialFormState, isValid: false };
  }

  return value;
};
export const useSignUpFormAction = () => {
  const value = useSignUpFormActionContext();

  if (!value) {
    return initialActionState;
  }

  return value;
};
