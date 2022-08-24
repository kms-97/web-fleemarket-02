import RButton from "@base/Button/RButton";
import Input from "@base/Input";
import Text from "@base/Text";
import styled from "@emotion/styled";
import React from "react";

interface Props {
  categories: { name: string }[];
  selectedCategory: string;
  checkValidate: () => void;
  onClickCategoryBtn: React.MouseEventHandler;
}

const ProductWriteTitle = (
  { categories, selectedCategory, onClickCategoryBtn, checkValidate }: Props,
  ref: React.ForwardedRef<HTMLInputElement>,
) => {
  const CategoryNotice = () => {
    return selectedCategory ? (
      <></>
    ) : (
      <Text fColor="GRAY2" size="sm">
        {"(필수) 카테고리를 선택해주세요"}
      </Text>
    );
  };

  return (
    <Container>
      <Input iSize="lg" placeholder="글 제목" ref={ref} onBlur={checkValidate} />
      <CategoryNotice />
      <CategoryList>
        {categories.map(({ name }) => (
          <RButton name="category" value={name} key={name} onClick={onClickCategoryBtn} />
        ))}
      </CategoryList>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  align-items: flex-start;

  padding: 24px 0;
  border-bottom: 1px solid ${({ theme }) => theme.COLOR.GRAY3};

  > input {
    border: solid 1px transparent;
    padding: 0;
  }
`;

const CategoryList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  column-gap: 4px;
  overflow: auto;

  label {
    width: 120px;
    font-size: 14px;
    flex-shrink: 0;
  }
`;

export default React.forwardRef(ProductWriteTitle);
