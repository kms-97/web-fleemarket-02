import React from "react";
import styled from "@emotion/styled";
import Input from "@base/Input";
import { DUMMY_LOCATION } from "@src/dummy/location";

import ModalPortal from "./ModalPortal";
import LeftIcon from "@icons/LeftIcon";
import Text from "@base/Text";
import { useInput } from "@hooks/useInput";
import CloseIcon from "@icons/CloseIcon";

interface Props {
  onClose: () => void;
  addLocation: any;
}

const SearchLocationModal = ({ onClose, addLocation }: Props) => {
  const [value, onChangeValue] = useInput();
  const { locations } = DUMMY_LOCATION;

  const selectedLocation = (location: any) => {
    const { id, dong, code } = location;

    const data = {
      id,
      dong,
      code,
      isActive: true,
    };

    addLocation(data);
    onClose();
  };

  return (
    <ModalPortal>
      <Container>
        <InputForm>
          <button onClick={onClose}>
            <LeftIcon />
          </button>
          <Input onChange={onChangeValue} value={value} />
        </InputForm>

        {value && <Text>{`"${value}"`} 검색결과</Text>}
        <SearchedLocations>
          {locations.map(({ id, sido, gungu, dong }, idx) => (
            <li key={id + String(idx)} onClick={() => selectedLocation({ id, sido, gungu, dong })}>
              <CloseIcon />
              <Text>{`${sido} ${gungu} ${dong}`}</Text>
            </li>
          ))}
        </SearchedLocations>
      </Container>
    </ModalPortal>
  );
};

const Container = styled.div`
  position: absolute;
  top: 0;

  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
  background-color: ${({ theme }) => theme.COLOR.WHITE};

  padding: 16px;

  & > * {
    width: 100%;
  }
  & p {
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

const InputForm = styled.div`
  width: 100%;
  display: flex;

  gap: 20px;
`;

const SearchedLocations = styled.ul`
  width: 100%;
  height: 100%;

  overflow-y: auto;

  display: flex;
  flex-direction: column;

  & > li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 0;

    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.COLOR.GRAY3};
    }
  }
`;

export default SearchLocationModal;
