import React, { useCallback, useRef, useState } from "react";
import styled from "@emotion/styled";
import Input from "@base/Input";

import ModalPortal from "./ModalPortal";
import LeftIcon from "@icons/LeftIcon";
import Text from "@base/Text";
import { useInput } from "@hooks/useInput";
import CloseIcon from "@icons/CloseIcon";
import { requestGetLocations } from "@apis/location";
import useDebounce from "@hooks/useDebounce";
import { useQuery } from "@hooks/useQuery";
import { ILocation, IUserLocation } from "types/location.type";

interface Props {
  onClose: () => void;
  addLocation: (location: IUserLocation) => void;
}

const SearchLocationModal = ({ onClose, addLocation }: Props) => {
  const ref = useRef(null);
  const [keyword, onChangeKeyword] = useInput("");
  const [locations, setLocations] = useState<ILocation[]>([]);

  const { refetch } = useQuery(["/searchLocation", keyword], requestGetLocations, {
    overrideCache: true,
    isCacheSave: false,
    firstFetch: false,
    onSuccess(data) {
      setLocations(data);
    },
  });

  const getLocationByKeyword = useCallback(() => {
    if (keyword.length === 0) {
      return;
    }

    refetch({ keyword });
  }, [keyword]);

  const selectedLocation = (location: ILocation) => {
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

  useDebounce(getLocationByKeyword, 500);

  return (
    <ModalPortal>
      <Container>
        <InputForm>
          <button onClick={onClose}>
            <LeftIcon />
          </button>
          <Input onChange={onChangeKeyword} value={keyword} />
        </InputForm>

        {keyword && <Text>{`"${keyword}"`} 검색결과</Text>}
        <SearchedLocations ref={ref}>
          {locations.map((location, idx) => {
            const { id, sido, gungu, dong } = location;

            return (
              <li key={id + String(idx)} onClick={() => selectedLocation(location)}>
                <CloseIcon />
                <Text>{`${sido} ${gungu} ${dong} ${idx}`}</Text>
              </li>
            );
          })}
        </SearchedLocations>
      </Container>
    </ModalPortal>
  );
};

const Container = styled.div`
  position: absolute;
  top: 0;
  z-index: 100;

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
