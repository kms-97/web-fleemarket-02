import React, { MouseEventHandler, useRef } from "react";
import styled from "@emotion/styled";
import VerticalIcon from "@icons/VerticalIcon";
import DropDown from "./";
import { IProduct, IProductItem } from "types/product.type";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@hooks/useMutation";
import { requestDeleteProduct } from "@apis/product";
import useDetectOutsideClick from "@hooks/useDetectOutside";
import Text from "@base/Text";

interface Props {
  className?: string;
  product: IProduct | IProductItem;
}

const DotDropdown = ({ className, product }: Props) => {
  const dropDownRef = useRef<HTMLUListElement>(null);
  const [isActive, onChangeActive] = useDetectOutsideClick(dropDownRef, false);
  const navigation = useNavigate();

  const toggle: MouseEventHandler = (e) => {
    e.stopPropagation();
    onChangeActive();
  };

  const [deleteMutate] = useMutation(requestDeleteProduct, {
    onSuccess: () => {
      navigation("/main");
    },
    cacheClear: true,
  });

  const onClickDelete: MouseEventHandler = (e) => {
    e.stopPropagation();
    deleteMutate(product.id);
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
