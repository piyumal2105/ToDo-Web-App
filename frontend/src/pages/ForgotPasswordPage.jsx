// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import axios from "axios";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/user/forgot-password",
        { email }
      );
      setAlert({ type: "success", message: response.data.message });
    } catch (error) {
      setAlert({ type: "error", message: error.response.data.message });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }}>
        Forgot Password
      </Typography>
      {alert.message && <Alert severity={alert.type}>{alert.message}</Alert>}
      <TextField
        label="Email"
        type="email"
        variant="outlined"
        margin="normal"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleForgotPassword}
      >
        Send OTP
      </Button>
    </Box>
  );
};

export default ForgotPasswordPage;
