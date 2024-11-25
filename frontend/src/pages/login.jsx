// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/user/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/todo");
    } catch (error) {
      console.error("Login failed:", error.response.data.message);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#f5f5f5", // Light background color
          p: 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            Welcome Back!
          </Typography>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.5 }}
            onClick={handleLogin}
          >
            Login
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Link
              component="button"
              variant="body2"
              onClick={handleForgotPassword}
              sx={{ color: "#1976d2", textDecoration: "none" }}
            >
              Forgot Password?
            </Link>
            <Link
              component="button"
              variant="body2"
              onClick={handleRegister}
              sx={{ color: "#1976d2", textDecoration: "none" }}
            >
              Register
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;
