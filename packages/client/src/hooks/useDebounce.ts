import { useEffect } from "react";

type IDe = (func: () => void, delay: number) => void;

const useDebounceEffect: IDe = (func, delay) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      func();
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [func, delay]);
};

export default useDebounceEffect;
