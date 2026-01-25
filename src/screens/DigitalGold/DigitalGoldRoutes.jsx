import React from "react";
import { Route, Routes } from "react-router-dom";

import DigitalGoldDashboard from "./DigitalGoldDashboard/DigitalGold"
import GoldOrderPage from "./GoldOrders/MobileOrders"

const DigitalGold = () => {
  return (
    <Routes>
      <Route path="/" element={<DigitalGoldDashboard />} />
      <Route path="/GoldOrders" element={<GoldOrderPage />} />

    </Routes>
  );
};

export default DigitalGold;