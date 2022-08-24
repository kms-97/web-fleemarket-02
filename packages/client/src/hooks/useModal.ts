import { useState } from "react";

type CallBackType = () => void;
type ReturnType = [boolean, CallBackType, CallBackType, CallBackType];

export const useModal = (): ReturnType => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const handler = () => {
    setIsOpen(!isOpen);
  };

  return [isOpen, open, close, handler];
};
