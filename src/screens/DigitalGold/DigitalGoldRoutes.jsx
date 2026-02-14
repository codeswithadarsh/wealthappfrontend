import React from "react";
import { Route, Routes } from "react-router-dom";

import DigitalGoldDashboard from "./DigitalGoldDashboard/DigitalGold"
import GoldOrderPage from "./GoldOrders/MobileOrders"
import GoldGraphHistory from "./GoldGraphHistory/GoldGraphHistory";

const DigitalGold = () => {
  return (
    <Routes>
      <Route path="/" element={<DigitalGoldDashboard />} />
      <Route path="/GoldOrders" element={<GoldOrderPage />} />
      <Route path="/GoldHistory" element={<GoldGraphHistory />} />

    </Routes>
  );
};

export default DigitalGold;