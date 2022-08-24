import Text from "@base/Text";
import CheckIcon from "@icons/CheckIcon";
import React from "react";
import FloatButton from "../FloatButton";
import Header from "../Header";

interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  isValid: boolean;
}

const ProductWriteHeader = ({ onClick, isValid }: Props) => {
  return (
    <Header>
      <Text>글쓰기</Text>
      <FloatButton
        type="submit"
        fixedPos="right"
        onClick={onClick}
        disabled={isValid ? false : true}
      >
        <CheckIcon />
      </FloatButton>
    </Header>
  );
};

export default ProductWriteHeader;
