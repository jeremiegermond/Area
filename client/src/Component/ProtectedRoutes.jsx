import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const auth = cookies.get("TOKEN");

export default function ProtectedRoutes(props) {
  useState(() => {
    if (auth == null ) {
      window.location.href="/login"
    }
  }, [])
  return auth.length <= 0 ? <Outlet /> : <>{props.children}</>;
}
