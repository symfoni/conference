import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/NavBar";
import { Symfoni } from "./hardhat/SymfoniContext";
import { Admin } from "./pages/Admin";
import { Home } from "./pages/Home";
import { Speakers } from "./pages/Speakers";
import { Tickets } from "./pages/Tickets";

function App() {
  return (
    <Symfoni autoInit={true}>
      <Router>
        <div className="App">
          <Navbar />
          <div style={{ margin: "10%", width: "60%" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/speakers" element={<Speakers />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Symfoni>
  );
}

export default App;
