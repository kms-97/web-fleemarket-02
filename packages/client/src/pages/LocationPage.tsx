import React from "react";
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
import { useToastMessageAction } from "@contexts/ToastMessageContext";

const LocationPage = () => {
  const { addToastMessage } = useToastMessageAction();
  const { data: user, updateCache } = useQuery(["userinfo"], requestGetLoginUserInfo);
  const [deleteMutate] = useMutation(
    requestDeleteUserLocation,
    {
      onError(error) {
        addToastMessage({ type: "error", message: error, isVisible: true });
      },
      cacheClear: true,
    },
    ["userinfo"],
  );

  const [addMutate] = useMutation(
    requestAddUserLocation,
    {
      onError(error) {
        addToastMessage({ type: "error", message: error, isVisible: true });
      },
      cacheClear: true,
    },
    ["userinfo"],
  );

  const [updateMutate] = useMutation(
    requestUpdateUserLocation,
    {
      onError(error) {
        addToastMessage({ type: "error", message: error, isVisible: true });
      },
      cacheClear: true,
    },
    ["userinfo"],
  );

  const addLocation = async (location: IUserLocation) => {
    if (!user) return;

    const { id } = location;
    const success = await addMutate({ locationId: id, userId: user?.id, isActive: true });
    if (!success) return;

    const newUser = { ...user };
    newUser.locations = newUser.locations.map((location) => {
      location.isActive = false;
      return location;
    });
    newUser.locations.push(location);
    updateCache(["userinfo"], newUser);
  };

  const deleteUserLocation = async (locationId: number) => {
    if (!user) return;
    const success = await deleteMutate({ locationId });
    if (!success) return;

    const newUser = { ...user };
    newUser.locations = newUser.locations
      .filter((location) => location.id !== locationId)
      .map((location) => {
        return { ...location, isActive: true };
      });
    updateCache(["userinfo"], newUser);
  };

  const activeUserLocation = async (locationId: number) => {
    if (!user) return;
    const success = await updateMutate({ locationId });
    if (!success) return;

    const newUser = { ...user };
    newUser.locations = newUser.locations.map((location) => {
      location.isActive = location.id === locationId;
      return location;
    });
    updateCache(["userinfo"], newUser);
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
};

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
