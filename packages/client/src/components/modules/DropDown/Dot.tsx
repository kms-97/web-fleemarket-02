import React, { MouseEventHandler, useRef } from "react";
import styled from "@emotion/styled";
import VerticalIcon from "@icons/VerticalIcon";
import DropDown from "./";
import { IProduct, IProductItem } from "types/product.type";
import { useNavigate } from "react-router-dom";
import useDetectOutsideClick from "@hooks/useDetectOutside";
import Text from "@base/Text";
import { useQuery } from "@hooks/useQuery";
import { requestGetLoginUserInfo } from "@apis/auth";

interface Props {
  className?: string;
  product: IProduct | IProductItem;
  deleteProduct: (...args: any[]) => Promise<boolean | undefined>;
}

const DotDropdown = ({ className, product, deleteProduct }: Props) => {
  const navigation = useNavigate();
  const dropDownRef = useRef<HTMLUListElement>(null);
  const [isActive, onChangeActive] = useDetectOutsideClick(dropDownRef, false);
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo);

  const toggle: MouseEventHandler = (e) => {
    e.stopPropagation();
    onChangeActive();
  };

  const onClickDelete: MouseEventHandler = (e) => {
    e.stopPropagation();
    deleteProduct(product);
  };

  const onClickModify: MouseEventHandler = (e) => {
    e.stopPropagation();
    navigation(`/product/update/${product.id}`);
  };

  return (
    <Container className={className}>
      <button onClick={toggle}>
        <VerticalIcon />
      </button>
      {isActive ? (
        <DropDown ref={dropDownRef}>
          <li onClick={onClickModify}>
            <Text>수정하기</Text>
          </li>
          <li onClick={onClickDelete}>
            <Text fColor="ERROR">삭제하기</Text>
          </li>
        </DropDown>
      ) : (
        <></>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;

  > ul {
    right: 5px;
  }
`;

export default DotDropdown;
