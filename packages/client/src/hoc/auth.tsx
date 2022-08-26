import React from "react";
import { useNavigate } from "react-router-dom";
import { requestGetLoginUserInfo } from "@apis/auth";
import { useQuery } from "@hooks/useQuery";

const auth = (WrappedComponent: React.ComponentType) => {
  const Component = () => {
    const navigation = useNavigate();

    useQuery(["userinfo"], requestGetLoginUserInfo, {
      onError() {
        navigation("/login", { replace: true });
      },
      cacheExpiredTime: Infinity,
    });

    if (data) return <WrappedComponent />;
    else return <></>;
  };
  return Component;
};

export default auth;
