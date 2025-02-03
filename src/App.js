import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginRegister from "./pages/LoginRegister";
import UploadPage from "./pages/UploadPage";
import ClientDashboard from "./pages/ClientDashboard"; 
import CompliancePie from "./components/CompliancePie";
import DailyTrendLine from "./components/DailyTrendLine";
import MonthlyProductAllocationBarChart from "./components/MonthlyProductAllocationBarChart";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/upload" element={<UploadPage />} /> {/* Solo para admins */}
        <Route path="/ClientDashboard" element={<ClientDashboard />} /> {/* Ruta para clientes */}
        <Route path="/compliancepie" element={<CompliancePie />} />
        <Route path="/dailytrendline" element={<DailyTrendLine />} />
        <Route path="/monthly-product-allocation" element={<MonthlyProductAllocationBarChart />} />
      </Routes>
    </div>
  );
};

export default App;
