import { Outlet, useLocation } from "react-router-dom";
import BottomBar from "../components/BottomBar/BottomBar";

const ProtectedLayout = () => {
  const { pathname } = useLocation();

  const hideBottomBar =
    pathname.startsWith("/profile")

  return (
    <>
      <Outlet />
      {!hideBottomBar && <BottomBar />}
    </>
  );
};

export default ProtectedLayout;
