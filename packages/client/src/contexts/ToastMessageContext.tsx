import React, { useContext, useMemo, useState } from "react";
import { createContext } from "react";

interface Props {
  children: React.ReactNode;
}

interface IToastMessageState {
  type: "notice" | "error";
  message: string | null;
  isVisible: boolean;
}

interface IToastMessageAction {
  addToastMessage: (toast: IToastMessageState) => void;
  deleteToastMessage: () => void;
}

const initialState: IToastMessageState = {
  type: "notice",
  message: null,
  isVisible: false,
};

const ToastMessageContext = createContext<IToastMessageState | null>(null);
const ToastMessageActionContext = createContext<IToastMessageAction | null>(null);

export const useToastMessageProvider = () => useContext(ToastMessageContext);
export const useToastMessageActionProvider = () => useContext(ToastMessageActionContext);

export const ToastProvider = ({ children }: Props) => {
  const [message, setMessage] = useState<IToastMessageState>({ ...initialState });

  const action: IToastMessageAction = useMemo(
    () => ({
      addToastMessage(toast) {
        setMessage(toast);
      },
      deleteToastMessage() {
        setMessage((prev) => ({ ...prev, isVisible: false }));
      },
    }),
    [],
  );

  return (
    <ToastMessageContext.Provider value={message}>
      <ToastMessageActionContext.Provider value={action}>
        {children}
      </ToastMessageActionContext.Provider>
    </ToastMessageContext.Provider>
  );
};

export const useToastMessage = () => {
  const value = useToastMessageProvider();

  if (!value) {
    throw new Error();
  }

  return value;
};

export const useToastMessageAction = () => {
  const value = useToastMessageActionProvider();

  if (!value) {
    throw new Error();
  }

  return value;
};
