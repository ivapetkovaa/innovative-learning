import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/store/store";

const Protected = () => {
  const { user } = useAppSelector((state) => state.user);

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default Protected;
