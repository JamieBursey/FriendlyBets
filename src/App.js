import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Banner, Buttons, Matches, LoginForm, NavBar } from "./Components"
import { Home } from "./Pages";

function App() {
  // const sportButtons = [
  //   { text: "Fighting", color: "btn-danger" },
  //   { text: "Hockey", color: "btn-light" },
  //   { text: "Football", color: "btn-warning" }
  // ]
  // const addRemovePlayer = [
  //   { text: "Add Player", color: "btn-primary" },
  //   { text: "Remove Player", color: "btn-primary" }
  // ]

  return (

    <div className='bg-dark'>
      <Home />
      <NavBar />
      <Banner />
      <Buttons />
      <Matches />
      <LoginForm />
    </div>
  );
}
export default App;

