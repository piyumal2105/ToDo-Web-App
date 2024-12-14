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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Fab,
  Snackbar,
  Alert,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "",
    deadline: "",
    tags: "",
    reminder: "",
  });

  // Snackbar state for feedback
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetching existing todos
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
  }, []);

  // Handle Sign Out
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("Signed out");
    window.location.href = "/";
  };

  // Handle Dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle Form Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTodo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle Todo Submission
  const handleAddTodo = async () => {
    const token = localStorage.getItem("token");

    // Check if the deadline is a future date
    const currentDate = new Date();
    const selectedDeadline = new Date(newTodo.deadline);

    if (selectedDeadline <= currentDate) {
      // Show error Snackbar if the deadline is not a future date
      setSnackbarMessage("Deadline must be a future date.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (token) {
      try {
        const response = await fetch("http://localhost:3001/todo/add", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        });

        if (response.ok) {
          const addedTodo = await response.json();
          setTodos((prevTodos) => [...prevTodos, addedTodo]);
          setOpen(false);
          setNewTodo({
            title: "",
            description: "",
            priority: "",
            deadline: "",
            tags: "",
            reminder: "",
          });

          // Show success Snackbar
          setSnackbarMessage("Todo added successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
        } else {
          console.error("Failed to add todo");

          // Show error Snackbar
          setSnackbarMessage("Failed to add Todo. Please try again.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error("Error adding todo:", error);

        // Show error Snackbar
        setSnackbarMessage("An error occurred. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Todo List
          </Typography>

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

        {/* Add Todo Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Todo</DialogTitle>
          <DialogContent sx={{ padding: "24px" }}>
            <TextField
              label="Title"
              name="title"
              value={newTodo.title}
              onChange={handleChange}
              fullWidth
              style={{ marginBottom: "16px", marginTop: "16px" }}
            />
            <TextField
              label="Description"
              name="description"
              value={newTodo.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              style={{ marginBottom: "16px" }}
            />
            <FormControl
              fullWidth
              style={{ marginBottom: "16px", marginTop: "16px" }}
            >
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={newTodo.priority}
                onChange={handleChange}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Deadline"
              name="deadline"
              type="date"
              value={newTodo.deadline}
              onChange={handleChange}
              fullWidth
              style={{ marginBottom: "16px" }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Reminder"
              name="reminder"
              type="datetime-local"
              value={newTodo.reminder}
              onChange={handleChange}
              fullWidth
              style={{ marginBottom: "16px" }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Tags"
              name="tags"
              value={newTodo.tags}
              onChange={handleChange}
              fullWidth
              style={{ marginBottom: "16px" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddTodo} color="primary">
              Add Todo
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      {/* Floating Action Button (FAB) for adding Todo */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleClickOpen}
        style={{
          position: "fixed",
          bottom: "70px",
          right: "70px",
        }}
      >
        <AddIcon />
      </Fab>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
