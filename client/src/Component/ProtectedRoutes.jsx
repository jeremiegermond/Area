import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";

export default function ProtectedRoutes() {
  const [element, setElement] = useState(<></>);
  useEffect(() => {
    const auth = new Cookies().get("TOKEN");
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${auth}` },
      })
      .then(() => {
        setElement(<Outlet />);
      })
      .catch(() => setElement(<Navigate to={"/login"} />));
  }, []);
  return element;
}
