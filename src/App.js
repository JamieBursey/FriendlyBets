import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Banner, Table } from "./Components"
import { Home } from "./Pages";

function buttons(buttonsData) {
  return (
    <div className="App text-bg-success p-3 mb-3">
      <div className="container text-center">
        <div className="row">
          {buttonsData ? buttonsData.map((button, index) => (
            <div className="col" key={index}>
              <button type="button" className={`btn ${button.color}`}>{button.text}</button>
            </div>)) : null}
        </div>
      </div>
    </div >)
}


function App() {
  const sportButtons = [
    { text: "Fighting", color: "btn-danger" },
    { text: "Hockey", color: "btn-light" },
    { text: "Football", color: "btn-warning" }
  ]
  const addRemovePlayer = [
    { text: "Add Player", color: "btn-primary" },
    { text: "Remove Player", color: "btn-primary" }
  ]
  return (

    <div className='bg-dark'>
      <Home />
      <div className="App-header">
        <Banner />
        <div className="text-center fs-1 text-success text-bg-dark p-3">Friendly Bets</div>
        <div className="App text-bg-success p-3 mb-3">
          <div className="container text-center">
            {buttons(sportButtons)}
          </div>
        </div>
        <div className="App text-bg-success p-3">
          <div className="container text-center">
            {buttons(addRemovePlayer)}

            <div className="row">
              <div className="col fs-4">
                Player 1
              </div>
              <div className="col fs-4">
                Player 2
              </div>
              <div className="col fs-4">
                Player 3
              </div>
            </div>
          </div>
        </div>
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

