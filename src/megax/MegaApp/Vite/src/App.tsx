import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import "./App.css";
import LoginPage from "./pages/Login/LoginPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
