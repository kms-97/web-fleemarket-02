import React from "react";
import { useNavigate } from "react-router-dom";

import styled from "@emotion/styled";
import Header from "@components/modules/Header";
import Text from "@base/Text";
import CategoryItem from "@components/modules/CategoryItem";
import Image from "@base/Image";

const categories = [
  { name: "디지털기기", img: "empty.jpg" },
  { name: "생활가전", img: "empty.jpg" },
  { name: "가구/인테리어", img: "empty.jpg" },
  { name: "게임/취미", img: "empty.jpg" },
  { name: "생활/가공식품", img: "empty.jpg" },
  { name: "스포츠/레저", img: "empty.jpg" },
  { name: "여성패션/잡화", img: "empty.jpg" },
  { name: "남성패션/잡화", img: "empty.jpg" },
  { name: "유아동", img: "empty.jpg" },
  { name: "뷰티/미용", img: "empty.jpg" },
  { name: "반려동물", img: "empty.jpg" },
  { name: "도서/티켓/음반", img: "empty.jpg" },
  { name: "식물", img: "empty.jpg" },
  { name: "기타 중고물품", img: "empty.jpg" },
];

const CategroyPage = () => {
  const navigation = useNavigate();

  const moveToMainPage = (category: string) => {
    navigation(`/main?category=${category}`);
  };

  return (
    <Container>
      <Header>
        <Text>카테고리</Text>
      </Header>
      <CategoryList>
        {categories.map((category) => (
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
