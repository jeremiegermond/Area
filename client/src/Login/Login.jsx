import "./Login.css";
import { FaFacebook, FaGoogle, FaTwitter } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { isConnected, postServer } from "../api";
import { setCookie } from "../cookie";

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    isConnected()
      .then(() => navigate("/home"))
      .catch(() => {});
  }, [navigate]);
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);
  const client = {
    username,
    password,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(client);
    postServer("login", client)
      .then((res) => {
        setLogin(true);
        setCookie("TOKEN", res.data.token);
        navigate("/home");
      })
      .catch(() => console.log("Submit error"));
  };

  return (
    <>
      <div className="home">
        <div className="login-box">
          <h1 className="title">Login</h1>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <div className="login-box-btns">
              <Form.Group controlId="formUsername">
                <label htmlFor="username"></label>
                <input
                  value={username}
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="btn"
                  onChange={(e) => setUser(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <label htmlFor="password"></label>
                <input
                  value={password}
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="btn"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="separator">
                <div className="line"></div>
                <h6>or</h6>
                <div className="line"></div>
              </div>
              <div className="login-box-icons">
                <FaTwitter className="icon" />
                <FaGoogle className="icon" />
                <FaFacebook className="icon" />
              </div>
            </div>
            <Button
              variant="primary"
              type="submit"
              className="login-btn"
              onClick={(e) => handleSubmit(e)}
            >
              Login
            </Button>
            {login ? (
              <p className="text-success">You are logged in</p>
            ) : (
              <p className="text-danger">You are not logged in</p>
            )}
          </Form>
          <p>
            You don't have an account ? Back to{" "}
            <Link to="/register">register</Link>
          </p>
        </div>
      </div>
    </>
  );
}
