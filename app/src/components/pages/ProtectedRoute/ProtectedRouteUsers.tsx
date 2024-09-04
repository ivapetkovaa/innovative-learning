import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/store/store";

const ProtectedForUsers = () => {
  const { user } = useAppSelector((state) => state.user);

  return user ? <Navigate to="/" /> : <Outlet />;
};

export default ProtectedForUsers;
