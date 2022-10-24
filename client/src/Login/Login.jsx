import "./Login.css";
import { FaFacebook, FaGoogle, FaTwitter } from "react-icons/fa";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function Register() {
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
    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, client)
      .then((res) => {
        setLogin(true);
        console.log(res);
        console.log(res.data);
        cookies.set("TOKEN", res.data.token, {
          path: "/",
        });
        window.location.href = "../home";
      })
      .catch((error) => {
        console.log(process.env);
        error = new Error();
      });
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
            You don't have an account ? Back to <a href="../register">register</a>
          </p>
        </div>
      </div>
    </>
  );
}
