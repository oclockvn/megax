import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import "./App.css";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login/LoginPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
