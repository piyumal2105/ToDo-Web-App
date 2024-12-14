// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const fetchTodos = async () => {
        try {
          const response = await fetch("http://localhost:3001/todo", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch todos");
          }

          const data = await response.json();
          console.log("Fetched data:", data);

          if (Array.isArray(data.todos)) {
            setTodos(data.todos);
          } else {
            console.error("Fetched data is not an array:", data);
            setTodos([]);
          }
        } catch (error) {
          console.error("Error fetching todos:", error);
          setTodos([]);
        } finally {
          setLoading(false);
        }
      };

      fetchTodos();
    } else {
      console.log("No token found. Redirecting to login...");
    }

    const user = localStorage.getItem("user");
    if (user) {
      setUserInfo(JSON.parse(user)); 
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    console.log("Signed out");
    window.location.href = "/";
  };

  const handleClickOpen = () => {
    setOpen(true); 
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Todo List
          </Typography>
          <IconButton color="inherit" onClick={handleClickOpen}>
            <PersonIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleSignOut}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container>
        {loading ? (
          <Typography variant="h6" align="center" style={{ marginTop: "20px" }}>
            Loading todos...
          </Typography>
        ) : (
          <Grid container spacing={3} style={{ marginTop: "20px" }}>
            {Array.isArray(todos) && todos.length > 0 ? (
              todos.map((todo) => (
                <Grid item xs={12} sm={6} md={4} key={todo.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {todo.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {todo.description}
                      </Typography>
                      <Button variant="outlined" color="primary" fullWidth>
                        Mark as Done
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography
                variant="body1"
                align="center"
                style={{ width: "100%" }}
              >
                No Todos found ...
              </Typography>
            )}
          </Grid>
        )}
      </Container>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>User Info</DialogTitle>
        <DialogContent>
          {userInfo ? (
            <div>
              <Typography variant="h6">Name: {userInfo.fullname}</Typography>
              <Typography variant="body1">Email: {userInfo.email}</Typography>
            </div>
          ) : (
            <Typography variant="body1">
              No user information available
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
