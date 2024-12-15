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
  Box,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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

  const [viewTodo, setViewTodo] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

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

    const currentDate = new Date();
    const selectedDeadline = new Date(newTodo.deadline);

    if (selectedDeadline <= currentDate) {
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

          setSnackbarMessage("Todo added successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
        } else {
          setSnackbarMessage("Failed to add Todo. Please try again.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (error) {
        setSnackbarMessage("An error occurred. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  // Handle View Todo
  const handleViewTodo = (todo) => {
    setViewTodo(todo);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewTodo(null);
  };

  // Function to determine the priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "green";
      case "Medium":
        return "orange";
      case "High":
        return "red";
      default:
        return "grey";
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
        {/* Priority Section on the Side */}
        <Box
          display="flex"
          flexDirection="column"
          position="fixed"
          top="100px"
          left="16px"
          padding={2}
          borderRadius={2}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            bgcolor="green"
            color="white"
            padding={1}
            borderRadius={1}
            width="100%"
            textAlign="center"
            marginBottom="8px"
          >
            <Typography>Low</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            bgcolor="orange"
            color="white"
            padding={1}
            borderRadius={1}
            width="100%"
            marginBottom="8px"
          >
            <Typography>Medium</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            bgcolor="red"
            color="white"
            padding={1}
            borderRadius={1}
            width="100%"
          >
            <Typography>High</Typography>
          </Box>
        </Box>

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
                    <Grid container spacing={0}>
                      <Grid
                        item
                        xs={0.4}
                        style={{
                          backgroundColor: getPriorityColor(todo.priority),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      ></Grid>

                      {/* Main Content */}
                      <Grid item xs={11}>
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
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            {
                              new Date(todo.deadline)
                                .toISOString()
                                .split("T")[0]
                            }
                          </Typography>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <IconButton
                              color="primary"
                              onClick={() => handleViewTodo(todo)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton color="info">
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error">
                              <DeleteIcon />
                            </IconButton>
                            <IconButton color="success">
                              <CheckCircleIcon />
                            </IconButton>
                          </div>
                        </CardContent>
                      </Grid>
                    </Grid>
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
          <DialogContent>
            <TextField
              label="Title"
              name="title"
              fullWidth
              value={newTodo.title}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              fullWidth
              value={newTodo.description}
              onChange={handleChange}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={newTodo.priority}
                onChange={handleChange}
                label="Priority"
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
              fullWidth
              value={newTodo.deadline}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Reminder"
              name="reminder"
              type="datetime-local"
              fullWidth
              value={newTodo.reminder}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              label="Tags"
              name="tags"
              fullWidth
              value={newTodo.tags}
              onChange={handleChange}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddTodo} color="primary">
              Add Todo
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Todo Dialog */}
        <Dialog
          open={viewOpen}
          onClose={handleViewClose}
          fullWidth
          maxWidth="sm" // Options: 'xs', 'sm', 'md', 'lg', 'xl'
        >
          <DialogTitle>Todo Details</DialogTitle>
          <DialogContent
            style={{
              padding: "24px",
              fontSize: "16px", // Adjust font size for better readability
            }}
          >
            {viewTodo && (
              <>
                <Typography variant="h5" style={{ marginBottom: "16px" }}>
                  Title: {viewTodo.title}
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "16px" }}>
                  <strong>Description:</strong> {viewTodo.description}
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "16px" }}>
                  <strong>Priority:</strong> {viewTodo.priority}
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "16px" }}>
                  <strong>Deadline:</strong>{" "}
                  {new Date(viewTodo.deadline).toLocaleDateString()}
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "16px" }}>
                  <strong>Tags:</strong> {viewTodo.tags}
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "16px" }}>
                  <strong>Reminder:</strong>{" "}
                  {viewTodo.reminder &&
                    new Date(viewTodo.reminder).toLocaleString()}
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleViewClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          style={{
            position: "fixed",
            bottom: "70px",
            right: "70px",
          }}
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>

        {/* Snackbar for Feedback */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}
