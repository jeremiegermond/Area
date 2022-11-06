import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isConnected } from "../api";

export default function ProtectedRoutes() {
  const [element, setElement] = useState(<></>);
  useEffect(() => {
    isConnected()
      .then(() => setElement(<Outlet />))
      .catch(() => setElement(<Navigate to={"/login"} />));
  }, []);
  return element;
}
