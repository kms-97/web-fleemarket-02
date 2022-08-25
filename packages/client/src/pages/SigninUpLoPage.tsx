import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

import Text from "@base/Text";
import Header from "@modules/Header";
import LocationForm from "@modules/LocationForm";
import { useSignUpForm } from "@contexts/SignUpContext";
import Button from "@base/Button";

const SigninUpLoPage = () => {
  const { data } = useSignUpForm();
  const navigation = useNavigate();
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    if (!data.userId.value) {
      navigation("/");
      return;
    }
  }, []);

  const addLocation = (location: any) => {
    const newLocations = locations.map((location) => {
      location.isActive = false;
      return location;
    });

    newLocations.push(location);

    setLocations(newLocations);
  };
  const deleteLocation = (locationId: any) => {
    const newLocations = locations.filter((location: any) => location.id !== locationId);

    setLocations(newLocations);
  };

  return (
    <Container>
      <Header>
        <Text>지역 선택</Text>
      </Header>
      <LocationForm
        locations={locations}
        addLocation={addLocation}
        deleteLocation={deleteLocation}
      />
      <Button size="lg">회원가입 완료</Button>
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

export default SigninUpLoPage;
