import React from "react";
import auth from "@hoc/auth";
import { useQuery } from "@hooks/useQuery";
import { requestGetLoginUserInfo } from "@apis/auth";
import { useMutation } from "@hooks/useMutation";
import {
  requestAddUserLocation,
  requestDeleteUserLocation,
  requestUpdateUserLocation,
} from "@apis/user";
import Header from "@modules/Header";
import Text from "@base/Text";
import LocationForm from "@modules/LocationForm";
import { IUserLocation } from "types/location.type";
import styled from "@emotion/styled";

const LocationPage = auth(() => {
  const { data: user } = useQuery(["userinfo"], requestGetLoginUserInfo);
  const [deleteMutate] = useMutation(requestDeleteUserLocation, { cacheClear: true }, ["userinfo"]);
  const [addMutate] = useMutation(requestAddUserLocation, { cacheClear: true }, ["userinfo"]);
  const [updateMutate] = useMutation(requestUpdateUserLocation, { cacheClear: true }, ["userinfo"]);

  const addLocation = (location: IUserLocation) => {
    const { id } = location;
    addMutate({ locationId: id, userId: user?.id, isActive: true });
  };

  const deleteUserLocation = (locationId: number) => {
    deleteMutate({ locationId });
  };

  const activeUserLocation = (locationId: number) => {
    updateMutate({ locationId });
  };

  if (!user) return <></>;
  return (
    <Container>
      <Header>
        <Text>지역 선택</Text>
      </Header>
      <Wrapper>
        <LocationForm
          locations={user.locations}
          addLocation={addLocation}
          deleteLocation={deleteUserLocation}
          activeLocation={activeUserLocation}
        />
      </Wrapper>
    </Container>
  );
});

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLOR.WHITE};
`;

const Wrapper = styled.section`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  padding: 24px 16px;

  & > button {
    margin-top: auto;
  }
`;

export default LocationPage;
