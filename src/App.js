import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "./App.css";
import {
  Home,
  About,
  Contact,
  Login,
  Register,
  MyAccount,
  AddFriends,
  FullSchedule,
  BetPage,
  MyBets,
  RenderRequests,
  UpdateMyAccount,
  UserManagement,
  EditUserAsAdmin,
  NflWeeklySchedulePage,
} from "./Pages";
import { NavBar } from "./Components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RedirectBasedOnLogin } from "./Data";

import UseAuthListener from "./Components/authRedirectHandler";
import ResetPassword from "./Pages/ResetPassword";
import { useTheme } from "./Components/theme/ThemeContext";

function App() {
  const { theme } = useTheme();
  const appStyle = {
    backgroundColor:
      theme === "light"
        ? "#FFFFFF"
        : theme === "dark"
        ? "#1E1E1E"
        : "transparent", // Fallback for other themes
    ...(theme === "retro" && {
      background: "linear-gradient(to bottom, #0B1305 0%, #00008B 100%)",
    }),
    color: theme === "light" ? "#000000" : "#FFFFFF",
    minHeight: "100vh",
  };
  return (
    <div style={appStyle}>
      <BrowserRouter>
        <NavBar />
        <UseAuthListener />
        <Routes>
          {/* Public Routes */}
          <Route path="/FriendlyBets" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/PasswordReset" element={<ResetPassword />} />
          {/* Protected Routes */}
          <Route
            path="/myAccount"
            element={
              <RedirectBasedOnLogin>
                <MyAccount />
              </RedirectBasedOnLogin>
            }
          />
          <Route
            path="/addFriends"
            element={
              <RedirectBasedOnLogin>
                <AddFriends />
              </RedirectBasedOnLogin>
            }
          />
          <Route
            path="/fullSchedule"
            element={
              <RedirectBasedOnLogin>
                <FullSchedule />
              </RedirectBasedOnLogin>
            }
          />
          <Route
            path="/betPage"
            element={
              <RedirectBasedOnLogin>
                <BetPage />
              </RedirectBasedOnLogin>
            }
          />
          <Route
            path="/MyBets"
            element={
              <RedirectBasedOnLogin>
                <MyBets />
              </RedirectBasedOnLogin>
            }
          />
          <Route
            path="/Notifications"
            element={
              <RedirectBasedOnLogin>
                <RenderRequests />
              </RedirectBasedOnLogin>
            }
          />
          <Route
            path="/UpdateMyAccount"
            element={
              <RedirectBasedOnLogin>
                <UpdateMyAccount />
              </RedirectBasedOnLogin>
            }
          />
          <Route
            path="/UserManagement"
            element={
              <RedirectBasedOnLogin>
                <UserManagement />
              </RedirectBasedOnLogin>
            }
          />
          <Route
            path="/EditUserAsAdmin"
            element={
              <RedirectBasedOnLogin>
                <EditUserAsAdmin />
              </RedirectBasedOnLogin>
            }
          />
          <Route
            path="/NflSchedule"
            element={
              <RedirectBasedOnLogin>
                <NflWeeklySchedulePage />
              </RedirectBasedOnLogin>
            }
          />

          <Route path="*" element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
