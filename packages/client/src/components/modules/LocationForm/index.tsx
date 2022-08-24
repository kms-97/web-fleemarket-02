import React, { useState } from "react";
import styled from "@emotion/styled";
import Button from "@base/Button";
import LButton from "@base/Button/LButton";
import Text from "@base/Text";
import { useModal } from "@hooks/useModal";
import SearchLocationModal from "@modals/SearchLocationModal";

interface Props {
  locations: any[];
  addLocation: any;
  deleteLocation: any;
}

const LocationForm = ({ locations, deleteLocation, addLocation }: Props) => {
  const [isOpen, openModal, closeModal] = useModal();

  return (
    <>
      <Container>
        <Text fColor="GRAY1">
          지역은 최소 1개 이상 <br /> 최대 2개까지 설정 가능해요
        </Text>
        <LocationList>
          {locations.length < 2 && <LButton onClick={openModal} />}
          {locations.map((location) => (
            <LButton
              key={location.id}
              location={location}
              onDelete={() => deleteLocation(location.id)}
            />
          ))}
        </LocationList>
      </Container>
      {isOpen && <SearchLocationModal onClose={closeModal} addLocation={addLocation} />}
    </>
  );
};

const Container = styled.section`
  flex: 1;
  width: 100%;
  padding: 24px 15px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  row-gap: 24px;

  & > button:last-child {
    margin-top: auto;
  }
`;

const LocationList = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  & > button {
    flex: 1;
  }
`;

export default LocationForm;
