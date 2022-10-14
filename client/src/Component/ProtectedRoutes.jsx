import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function ProtectedRoutes(props) {
  const [auth, setAuth] = useState("");
  useEffect(() => {
    // cookies
    // setAuth(getlocalstorage @auth);
  }, []);

  return auth.length <= 0 ? <Outlet /> : <>{props.children}</>;
}
