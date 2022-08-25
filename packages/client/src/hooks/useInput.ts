import React, { useState } from "react";

type ReturnType = [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  React.Dispatch<React.SetStateAction<string>>,
];

export const useInput = (initialValue = ""): ReturnType => {
  const [value, setValue] = useState(initialValue);

  const handler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return [value, handler, setValue];
};
