import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { requestGetLoginUserInfo } from "@apis/auth";
import { useQuery } from "@hooks/useQuery";

const VerifyAuth = () => {
  const {
    data: user,
    loading,
    error,
  } = useQuery(["userinfo"], requestGetLoginUserInfo, {
    cacheExpiredTime: Infinity,
  });

  if (!error && loading) return <></>;

  if (error && !loading && !user) return <Navigate to="/" />;

  return <Outlet />;
};

export default VerifyAuth;
