import { FC, useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: React.ReactNode;
}

const ModalPortal: FC<Props> = ({ children }) => {
  const modalRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    modalRef.current = document.getElementById("modal");

    return () => {
      setMounted(false);
    };
  }, []);

  return mounted ? createPortal(children, modalRef.current as HTMLElement) : null;
};

export default ModalPortal;
