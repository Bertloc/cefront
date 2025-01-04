import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginRegister from "./pages/LoginRegister";
import UploadPage from "./pages/UploadPage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </div>
  );
};

export default App;
