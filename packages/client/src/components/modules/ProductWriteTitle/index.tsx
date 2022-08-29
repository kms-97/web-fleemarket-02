import RButton from "@base/Button/RButton";
import Input from "@base/Input";
import Text from "@base/Text";
import styled from "@emotion/styled";
import React from "react";
import { ICategory } from "types/category.type";

interface Props {
  categories: ICategory[];
  selectedCategory: string;
  checkValidate: () => void;
  onClickCategoryBtn: React.MouseEventHandler;
  onChangeTitle?: React.ChangeEventHandler<HTMLInputElement>;
  titleValue: string;
}

const ProductWriteTitle = (
  {
    categories,
    selectedCategory,
    onClickCategoryBtn,
    checkValidate,
    titleValue = "",
    onChangeTitle,
  }: Props,
  ref: React.ForwardedRef<HTMLInputElement>,
) => {
  return (
    <Container>
      <Input
        iSize="lg"
        placeholder="글 제목"
        ref={ref}
        onBlur={checkValidate}
        value={titleValue}
        onChange={onChangeTitle}
        maxLength={255}
      />
      {categories && titleValue && (
        <>
          <Text fColor="GRAY2" size="sm">
            {"(필수) 카테고리를 선택해주세요"}
          </Text>
          <CategoryList>
            {categories.map(({ name }) => (
              <RButton
                name="category"
                value={name}
                key={name}
                onClick={onClickCategoryBtn}
                defaultChecked={name === selectedCategory ? true : false}
              />
            ))}
          </CategoryList>
        </>
      )}
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
