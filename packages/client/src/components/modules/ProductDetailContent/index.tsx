import React, { MouseEventHandler, useState } from "react";
import styled from "@emotion/styled";
import Text from "@base/Text";
import Carousel from "../Carousel";
import { IProduct } from "types/product.type";
import { getExpriedTime } from "@utils/timeCalculate";
import StatusDropdown from "@modules/DropDown/Status";
import { useMutation } from "@hooks/useMutation";
import { requestPatchProduct } from "@apis/product";
import { useQuery } from "@hooks/useQuery";
import { useToastMessageAction } from "@contexts/ToastMessageContext";

interface Props {
  product: IProduct;
  isMyProduct: boolean;
}

const ProductDetailContent = ({ product, isMyProduct }: Props) => {
  const { addToastMessage } = useToastMessageAction();
  const { title, category, createdAt, location, seller, description, imgUrl } = product;
  const { updateCache } = useQuery([], async () => {
    return;
  });
  const [status, setStatus] = useState(product.status);

  const [changeStatus] = useMutation(
    async (newStatus: "판매중" | "예약중" | "거래완료") => {
      return requestPatchProduct(product.id, { status: newStatus });
    },
    {
      onSuccess(data, ...args) {
        const newProduct = { ...product };
        const [newStatus] = args;
        newProduct.status = newStatus;
        setStatus(newStatus);
        updateCache(["product", Number(product.id)], newProduct);
        addToastMessage({ type: "notice", message: "수정되었습니다.", isVisible: true });
      },
      onError(error) {
        addToastMessage({ type: "error", message: error, isVisible: true });
      },
    },
  );

  const onClickStatusList: MouseEventHandler = (e) => {
    e.stopPropagation();
    const li = (e.target as HTMLElement).closest("li");
    if (!li) return;

    const value = li.dataset.status as "판매중" | "예약중" | "거래완료";
    changeStatus(value);
  };

  return (
    <>
      <Carousel images={[...imgUrl]} />
      <DetailSection>
        {isMyProduct ? <StatusDropdown value={status} onClick={onClickStatusList} /> : ""}
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
  word-break: break-word;
  flex-grow: 1;

  > p {
    justify-content: flex-start;
  }
`;

const DetailSaler = styled.div`
  width: 100%;
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
