import React, { MouseEventHandler, useEffect, useRef } from "react";
import SButton from "@base/Button/SButton";
import Text from "@base/Text";
import DropDown from "./";
import useDetectOutsideClick from "@hooks/useDetectOutside";
import styled from "@emotion/styled";

interface Props {
  value: "판매중" | "예약중" | "거래완료";
  onClick: MouseEventHandler;
}

const StatusDropdown = ({ value, onClick }: Props) => {
  const dropDownRef = useRef<HTMLUListElement>(null);
  const [isActive, onChangeActive, setIsActive] = useDetectOutsideClick(dropDownRef, false);

  useEffect(() => {
    setIsActive(false);
  }, [value]);

  const toggle: MouseEventHandler = (e) => {
    e.stopPropagation();
    onChangeActive();
  };

  return (
    <Container>
      <SButton onClick={toggle}>
        <Text size="md">{value}</Text>
      </SButton>
      {isActive ? (
        <DropDown ref={dropDownRef} onClick={onClick}>
          <li data-status="판매중">판매중</li>
          <li data-status="예약중">예약중</li>
          <li data-status="거래완료">거래완료</li>
        </DropDown>
      ) : (
        ""
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;

  > ul {
    left: 0px;
  }
`;

export default StatusDropdown;
