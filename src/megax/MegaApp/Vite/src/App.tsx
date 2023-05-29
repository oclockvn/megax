import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import "./App.css";
import HomeTemplate from "./pages";
import HomePage from "./pages/Home/Home";
import LoginPage from "./pages/Login/LoginPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeTemplate Component={HomePage} />} />

          <Route
            path="/login"
            element={<HomeTemplate Component={LoginPage} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
