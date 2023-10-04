import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
// import { Home } from "./Pages";
import {AboutPage} from "./Pages";

function App() {
  return (
    <div className="bg-dark">
      {/* <Home /> */}
      <AboutPage />
    </div>
  );
}
export default App;
