import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Banner, Buttons, HockeyGrid } from "./Components"
import { Home } from "./Pages";

function App() {

  return (

    <div className='bg-dark'>
      <Home />
      <Banner />
      <Buttons />
      <HockeyGrid />
    </div>
  );
}
export default App;

