import { Outlet } from "react-router-dom";
import BottomBar from "../components/BottomBar/BottomBar";

const ProtectedLayout = () => {
  return (
    <>
      <Outlet />
      <BottomBar />
    </>
  );
};

export default ProtectedLayout;
