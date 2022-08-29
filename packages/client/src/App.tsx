import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import SignUpLoPage from "@pages/SignUpLoPage";
import Template from "@components/template";
import ProductDetailPage from "@pages/ProductDetailPage";
import ToastMessage from "@modules/ToastMessage";
import ProductWritePage from "./pages/ProductWritePage";
import CategroyPage from "./pages/CategoryPage";
import CoverPage from "./pages/CoverPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MainPage from "./pages/MainPage";
import LocationPage from "@pages/LocationPage";
import { useQuery } from "@hooks/useQuery";
import { requestGetLoginUserInfo } from "@apis/auth";
import UserProfilePage from "@pages/UserProfilePage";
import ProductUpdatePage from "@pages/ProductUpdatePage";
import ProductChatPage from "@pages/ProductChatPage";
import ChatDetailPage from "@pages/ChatDetailPage";
import VerifyAuth from "@components/VerifyAuth";

const App = () => {
  const location = useLocation();

  useQuery(["userinfo"], requestGetLoginUserInfo, {
    cacheExpiredTime: Infinity,
  });

  const childFactory = (child: React.ReactElement) => {
    return React.cloneElement(child, { classNames: "fade" });
  };

  return (
    <Template>
      <TransitionGroup className="transition-group" childFactory={childFactory}>
        <CSSTransition key={location.pathname} timeout={350}>
          <Routes location={location}>
            <Route path="/" element={<CoverPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signup/location" element={<SignUpLoPage />} />
            <Route path="" element={<VerifyAuth />}>
              <Route path="/main" element={<MainPage />} />
              <Route path="/category" element={<CategroyPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/product/:id/chat" element={<ProductChatPage />} />
              <Route path="/chat/:chatRoomId" element={<ChatDetailPage />} />
              <Route path="/product/update/:productId" element={<ProductUpdatePage />} />
              <Route path="/product/write" element={<ProductWritePage />} />
              <Route path="/location" element={<LocationPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
            </Route>
          </Routes>
        </CSSTransition>
      </TransitionGroup>
      <ToastMessage />
      <div id="modal" />
    </Template>
  );
};

export default App;
