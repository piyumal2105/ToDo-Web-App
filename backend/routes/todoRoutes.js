import express from "express";
import {
  addTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  toggleTodoCompletion,
} from "../controllers/todoController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authenticateUser, addTodo);
router.get("/", authenticateUser, getTodos);
router.put("/:todoId", authenticateUser, updateTodo);
router.delete("/:todoId", authenticateUser, deleteTodo);
router.patch(
  "/:todoId/toggle-completion",
  authenticateUser,
  toggleTodoCompletion
);

export default router;
