import { useRef, useEffect, useCallback } from "react";

type IProps = (targetEl: any, fetchCallback: () => void) => void;

const useFetchScroll: IProps = (targetEl, fetchCallback) => {
  const observerRef = useRef<IntersectionObserver | null>();

  const getObserver = useCallback(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && targetEl.current?.lastElementChild) {
          fetchCallback();
          observerRef.current?.unobserve(targetEl.current.lastElementChild);
        }
      },
      { rootMargin: "0px", threshold: 0.3 },
    );
  }, [fetchCallback]);

  useEffect(() => {
    if (!targetEl.current?.lastElementChild || targetEl.current?.childNodes.length % 10 !== 0)
      return;

    getObserver();
    observerRef.current?.observe(targetEl.current.lastElementChild);

    return () => {
      observerRef.current = null;
    };
  }, [targetEl.current, getObserver]);
};

export default useFetchScroll;
