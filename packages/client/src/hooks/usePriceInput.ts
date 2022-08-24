import { useLayoutEffect, useState } from "react";

export const usePriceInput = (initialValue: string) => {
  const [priceString, setPriceString] = useState<string>(initialValue);
  const [price, setPrice] = useState<number>(0);

  useLayoutEffect(() => {
    const numberValue = Number(priceString.replaceAll(/[^0-9]/g, ""));

    if (!numberValue) {
      setPriceString("");
      setPrice(0);
    } else {
      setPriceString(`₩ ${numberValue.toLocaleString()}`);
      setPrice(numberValue);
    }
  }, [priceString]);

  return { price, priceString, setPriceString };
};
