import React from "react";
import { useNavigate } from "react-router-dom";

import styled from "@emotion/styled";
import CategoryItem from "@components/modules/CategoryItem";
import Header from "@components/modules/Header";
import Text from "@base/Text";
import { useQuery } from "@hooks/useQuery";
import { ICategory } from "types/category.type";
import { requestGetCategory } from "@src/apis/category";

const CategroyPage = () => {
  const navigation = useNavigate();
  const { data: categories } = useQuery<ICategory[]>(["category"], requestGetCategory, {});

  const moveToMainPage = (category: string) => {
    navigation(`/main?category=${category}`);
  };

  return (
    <Container>
      <Header>
        <Text>카테고리</Text>
      </Header>
      <CategoryList>
        {categories &&
          categories.map((category) => (
            <CategoryItem key={category.name} category={category} onClick={moveToMainPage} />
          ))}
      </CategoryList>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLOR.WHITE};
`;

const CategoryList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  row-gap: 24px;

  justify-items: center;
  align-items: center;

  padding: 24px 16px;
`;

export default CategroyPage;
