import { useEffect, useState } from "react";

interface params {
  [key: string]: string;
}

export const useSearchParam = () => {
  const [params, setParams] = useState<params>({});

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    setParams(params);
  }, []);

  return params;
};
