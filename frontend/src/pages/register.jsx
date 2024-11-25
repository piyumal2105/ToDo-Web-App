// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { TextField, Button, Box, Typography, Link, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3001/user/register", {
        fullName,
        email,
        password,
      });

      // Show success alert
      setAlert({ type: "success", message: "Registration successful!" });

      // Navigate to login page after a short delay
      setTimeout(() => {
        setAlert({ type: "", message: "" });
        navigate("/");
      }, 2000);
    } catch (error) {
      // Show error alert
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Registration failed!",
      });
    }
  };

  const handleLoginRedirect = () => {
    navigate("/");
  };

  return (
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
          Create an Account
        </Typography>

        {/* Show Alert if there's a message */}
        {alert.message && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        <TextField
          label="Full Name"
          variant="outlined"
          margin="normal"
          fullWidth
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
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
          onClick={handleRegister}
        >
          Register
        </Button>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Typography variant="body2">
            Already have an account?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={handleLoginRedirect}
              sx={{ color: "#1976d2", textDecoration: "none" }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
