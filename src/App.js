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
  FetchFromAPI,
  FullSchedule,
  BetPage,
  MyBets,
  FriendRequests,
  UpdateMyAccount,
} from "./Pages";
import { NavBar } from "./Components";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="bg-dark" style={{ minHeight: "100vh" }}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/myAccount" element={<MyAccount />} />
          <Route path="/addFriends" element={<AddFriends />} />
          {/* <Route path="/test/fetchFromAPI" element={<FetchFromAPI />} /> */}
          <Route path="/fullSchedule" element={<FullSchedule />} />
          <Route path="/betPage" element={<BetPage />} />
          <Route path="/MyBets" element={<MyBets />} />
          <Route path="/Notifications" element={<FriendRequests />} />
          <Route path="/UpdateMyAccount" element={<UpdateMyAccount />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
