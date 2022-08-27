import { useState } from "react";
import { useToastMessageAction } from "@contexts/ToastMessageContext";

const PRICE_LIMIT = 100_000_000;

export const usePriceInput = (initialValue: string) => {
  const { addToastMessage } = useToastMessageAction();
  const [priceString, setPriceString] = useState<string>(initialValue);
  const [price, setPrice] = useState<number>(0);

  const changePriceString = (value: string) => {
    const numberValue = Number(value.replaceAll(/[^0-9]/g, ""));
    if (!numberValue) {
      setPriceString("");
      setPrice(0);
    }
    if (numberValue > PRICE_LIMIT) {
      addToastMessage({
        type: "error",
        message: "금액은 최대 1억까지 입력 가능합니다.",
        isVisible: true,
      });
    } else {
      setPriceString(`₩ ${numberValue.toLocaleString()}`);
      setPrice(numberValue);
    }
  };

  return { price, priceString, changePriceString };
};
