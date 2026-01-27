import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import UserLogin from "./screens/UserLogin/UserLogin";
import DigitalGold from "./screens/DigitalGold/DigitalGoldRoutes";
import Dashboard from "./screens/Dashboard/Dashboard";
import { Toaster } from "react-hot-toast";
import Profile from "./screens/UserProfile/Profile";
import ProtectedLayout from "./routes/ProtectedLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000
        }}
        containerStyle={{
          zIndex: 99999999
        }}

      />
      <Routes>

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<UserLogin />} />

        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/digitalGold/*" element={<DigitalGold />} />
            <Route path="/Profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<UserLogin />} />

      </Routes>

    </BrowserRouter>
  );
};

export default App;
