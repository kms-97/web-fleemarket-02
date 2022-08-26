import { MutableRefObject, useState, useEffect, Dispatch, SetStateAction } from "react";

type ReturnObj = [boolean, () => void, Dispatch<SetStateAction<boolean>>];

const useDetectOutsideClick = (
  el: MutableRefObject<Node | null>,
  initialState: boolean,
): ReturnObj => {
  const [isActive, setIsActive] = useState(initialState);

  const onChangeActive = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (el.current !== null && !el.current.contains(e.target as Node)) setIsActive(false);
    };

    if (isActive) document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, [isActive, el]);

  return [isActive, onChangeActive, setIsActive];
};

export default useDetectOutsideClick;
