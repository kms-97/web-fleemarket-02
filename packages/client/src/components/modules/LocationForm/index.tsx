import React from "react";
import styled from "@emotion/styled";
import LButton from "@base/Button/LButton";
import Text from "@base/Text";
import { useModal } from "@hooks/useModal";
import SearchLocationModal from "@modals/SearchLocationModal";
import { IUserLocation } from "types/location.type";

interface Props {
  locations: IUserLocation[];
  addLocation: (location: IUserLocation) => void;
  deleteLocation: (locationId: number) => void;
  activeLocation: (locationId: number) => void;
}

const LocationForm = ({ locations, deleteLocation, addLocation, activeLocation }: Props) => {
  const [isOpen, openModal, closeModal] = useModal();

  return (
    <>
      <Container>
        <Text fColor="GRAY1">
          지역은 최소 1개 이상 <br /> 최대 2개까지 설정 가능해요
        </Text>
        <LocationList>
          {locations.map((location) => (
            <LButton
              key={location.id}
              location={location}
              onDelete={deleteLocation}
              onClick={() => activeLocation(location.id)}
            />
          ))}
          {locations.length < 2 && <LButton onClick={openModal} />}
        </LocationList>
      </Container>
      {isOpen && <SearchLocationModal onClose={closeModal} addLocation={addLocation} />}
    </>
  );
};

const Container = styled.section`
  flex: 1;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  row-gap: 24px;
`;

const LocationList = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  & > button {
    flex: 1;
  }
`;

export default LocationForm;
