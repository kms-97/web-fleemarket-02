import React from "react";
import Text from "@base/Text";
import styled from "@emotion/styled";
import CategorySvg from "@icons/CategorySvg";

interface Props {
  category: any;
  onClick: (category: string) => void;
}

const CategoryItem = ({ category, onClick }: Props) => {
  const { name, imgUrl } = category;

  const onClickCategoryItem = () => {
    onClick(name);
  };

  return (
    <StyledButton onClick={onClickCategoryItem}>
      <CategorySvg svg={imgUrl} />
      <Text size="sm">{name}</Text>
    </StyledButton>
  );
};

const StyledButton = styled.button`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  width: fit-content;
  row-gap: 16px;

  &:hover,
  :focus {
    & > p {
      color: ${({ theme }) => theme.COLOR.PRIMARY1};
    }
  }
`;

export default CategoryItem;
