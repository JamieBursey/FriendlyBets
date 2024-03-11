import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { adminUser } from "./Data";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { RedirectBasedOnLogin } from "./Data";
import backgroundColor from "./Pages/Register";
function App() {
  useEffect(() => {
    adminUser();
  }, []);

  return (
    <div style={backgroundColor}>
      <BrowserRouter>
        <NavBar />
        <RedirectBasedOnLogin />
        <Routes>
          <Route path="/FriendlyBets" element={<Home />} />
          <Route path="/about" element={<LandingPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/myAccount" element={<MyAccount />} />
          <Route path="/addFriends" element={<AddFriends />} />
          {/* <Route path="/test/fetchFromAPI" element={<FetchFromAPI />} /> */}
          <Route path="/fullSchedule" element={<FullSchedule />} />
          <Route path="/betPage" element={<BetPage />} />
          <Route path="/MyBets" element={<MyBets />} />
          <Route path="/Notifications" element={<RenderRequests />} />
          <Route path="/UpdateMyAccount" element={<UpdateMyAccount />} />
          <Route path="/UpdateMyAccount" element={<UpdateMyAccount />} />
          <Route path="/UserManagement" element={<UserManagement />} />
          <Route path="/EditUserAsAdmin" element={<EditUserAsAdmin />} />
          <Route path="/NflSchedule" element={<NflWeeklySchedulePage />} />
          <Route path="/LandingPage" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
