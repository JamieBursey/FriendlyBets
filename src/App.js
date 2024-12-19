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
  LandingPage,
} from "./Pages";
import { NavBar } from "./Components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RedirectBasedOnLogin } from "./Data";
import backgroundColor from "./Pages/Register";
import UseAuthListener from "./Components/authRedirectHandler";
import ResetPassword from "./Pages/ResetPassword";

function App() {

  return (
    <div style={backgroundColor}>
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
          <Route path="/LandingPage" element={<LandingPage />} />
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

          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
