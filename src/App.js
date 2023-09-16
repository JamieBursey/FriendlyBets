import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Banner, Table, Buttons } from "./Components"
import { Home } from "./Pages";

function App() {

  return (

    <div className='bg-dark'>
      <Home />
      <div className="App-header">
        <Banner />
        <Buttons />
      </div>
      <div className='container'>
        <div>
          <Table />
        </div>
      </div>
    </div>
  );
}
export default App;

