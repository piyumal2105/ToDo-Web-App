import Todo from "../models/todoModel.js";

// Add Todo
export const addTodo = async (req, res) => {
  const { title, description, priority, deadline, tags, reminder } = req.body;

  try {
    const newTodo = new Todo({
      title,
      description,
      priority,
      deadline,
      tags,
      reminder,
      completed: false,
      userId: req.user._id,
    });

    await newTodo.save();

    res.status(201).json({ message: "Todo added successfully", todo: newTodo });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding todo", details: error.message });
  }
};

// Get Todos
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id });

    res.status(200).json({ todos });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving todos", details: error.message });
  }
};

// Update Todo
export const updateTodo = async (req, res) => {
  const { todoId } = req.params;
  const { title, description, priority, deadline, tags, reminder, completed } =
    req.body;

  try {
    const todo = await Todo.findOne({ _id: todoId, userId: req.user._id });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    // Update fields
    if (title) todo.title = title;
    if (description) todo.description = description;
    if (priority) todo.priority = priority;
    if (deadline) todo.deadline = deadline;
    if (tags) todo.tags = tags;
    if (reminder) todo.reminder = reminder;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();

    res.status(200).json({ message: "Todo updated successfully", todo });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating todo", details: error.message });
  }
};

// Delete Todo
export const deleteTodo = async (req, res) => {
  const { todoId } = req.params;

  try {
    const todo = await Todo.findOneAndDelete({
      _id: todoId,
      userId: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting todo", details: error.message });
  }
};

// Toggle Completion Status
export const toggleTodoCompletion = async (req, res) => {
  const { todoId } = req.params;

  try {
    const todo = await Todo.findOne({ _id: todoId, userId: req.user._id });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json({ message: "Todo completion status updated", todo });
  } catch (error) {
    res.status(500).json({
      error: "Error updating completion status",
      details: error.message,
    });
  }
};
