import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import styled from "@emotion/styled";

import Text from "@base/Text";
import Header from "@modules/Header";
import LocationForm from "@modules/LocationForm";
import { useSignUpForm, useSignUpFormAction } from "@contexts/SignUpContext";
import Button from "@base/Button";
import { useMutation } from "@hooks/useMutation";
import { requestSignUp } from "@apis/user";
import { IUserLocation } from "types/location.type";
import { ISignUpUser } from "types/user.type";

const SignUpLoPage = () => {
  const navigation = useNavigate();
  const { clearState } = useSignUpFormAction();
  const { data } = useSignUpForm();
  const [cookies] = useCookies();
  const [locations, setLocations] = useState<IUserLocation[]>([]);
  const [signUpMutation] = useMutation(requestSignUp, {
    onSuccess(_) {
      clearState();
      navigation("/login");
    },
    onError(error) {
      // toast
      console.log();
    },
  });

  useEffect(() => {
    if (!data.userId.value) {
      navigation("/");
      return;
    }
  }, []);

  const onClickSignUpButton = useCallback(() => {
    if (locations.length === 0) {
      // toast
      return;
    }

    const { userId, password, name } = data;

    const newLocations = locations.map(({ id, isActive }) => {
      return { locationId: id, isActive };
    });

    const bodyData: ISignUpUser = {
      userId: userId.value,
      password: password.value,
      name: name.value,
      locations: newLocations,
    };

    if (cookies["github"]) {
      bodyData.github = cookies["github"];
    }
    signUpMutation(bodyData);
  }, [data, locations]);

  const addLocation = (location: IUserLocation) => {
    const isExist = locations.find((_location) => _location.id === location.id);

    if (isExist) {
      // toast
      return;
    }
    const newLocations = locations.map((location) => {
      location.isActive = false;
      return location;
    });

    newLocations.push(location);
    setLocations(newLocations);
  };

  const deleteLocation = (locationId: number) => {
    if (locations.length === 1) {
      // toast
      return;
    }

    const newLocations = locations.filter((location) => {
      location.isActive = location.id !== locationId;

      return location.id !== locationId;
    });

    setLocations(newLocations);
  };

  const activeLocation = (locationId: number) => {
    const newLocations = locations.map((location) => {
      location.isActive = location.id === locationId;
      return location;
    });
    setLocations(newLocations);
  };

  return (
    <Container>
      <Header>
        <Text>지역 선택</Text>
      </Header>
      <Wrapper>
        <LocationForm
          locations={locations}
          addLocation={addLocation}
          deleteLocation={deleteLocation}
          activeLocation={activeLocation}
        />
        <Button size="lg" onClick={onClickSignUpButton} disabled={locations.length === 0}>
          회원가입 완료
        </Button>
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

export default SignUpLoPage;
