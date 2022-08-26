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
      cacheExpiredTime: 1000 * 60 * 60,
    });

    return <WrappedComponent />;
  };
  return Component;
};

export default auth;
