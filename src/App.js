import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Banner, Table, Buttons } from "./Components"
import { Home } from "./Pages";

function App() {

  return (

    <div className='bg-dark'>
      <Home />
      <Banner />
      <Buttons />
      <Table />
    </div>

  );
}
export default App;

