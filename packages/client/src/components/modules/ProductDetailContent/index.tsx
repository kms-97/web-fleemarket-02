import React from "react";
import styled from "@emotion/styled";
import Text from "@base/Text";
import Carousel from "../Carousel";
import { IProduct } from "types/product.type";
import { getExpriedTime } from "@utils/timeCalculate";

interface Props {
  product: IProduct;
}

const ProductDetailContent = ({ product }: Props) => {
  const { title, category, createdAt, location, seller, description, imgUrl } = product;
  return (
    <>
      <Carousel images={[...imgUrl]} />
      <DetailSection>
        <DetailTitle>
          <Text size="lg">{title}</Text>
          <Text size="sm" fColor="GRAY1">
            {category.name} ∙ {getExpriedTime(createdAt)}
          </Text>
        </DetailTitle>
        <DetailDesc>
          <Text size="md">{description}</Text>
        </DetailDesc>
        <DetailSaler>
          <Text size="md" isBold={true}>
            판매자 정보
          </Text>
          <div>
            <Text size="md" isBold={true}>
              {seller.name}
            </Text>
            <Text size="md" fColor="GRAY1">
              {location.dong}
            </Text>
          </div>
        </DetailSaler>
      </DetailSection>
    </>
  );
};

const DetailSection = styled.section`
  display: flex;
  flex-direction: column;
  padding: 24px 16px 32px 16px;

  flex-grow: 1;

  row-gap: 20px;
`;

const DetailTitle = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;

  align-items: flex-start;
`;

const DetailDesc = styled.div`
  white-space: pre-wrap;
  flex-grow: 1;

  > p {
    justify-content: flex-start;
  }
`;

const DetailSaler = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;

  padding: 16px;

  background-color: ${({ theme }) => theme.COLOR.BACKGROUND};

  > div {
    display: flex;
    column-gap: 8px;
  }
`;

export default ProductDetailContent;
