import React from "react";
import "./App.css";
import logo from "./logo.png"; // Import PulseChain logo image
import logoPulseX from "./logoPulseX.png"; // Import the PulseX logo image
import logoHEX from "./logoHEX.png"; // Import the HEX logo image

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <img src={logoHEX} alt="HEX Logo" className="logo" />
          <img src={logo} alt="PulseChain Logo" className="logo" />
          <img src={logoPulseX} alt="PulseX Logo" className="logo" />
        </div>
        <h1>Site retired</h1>
      </header>
    </div>
  );
}

export default App;
