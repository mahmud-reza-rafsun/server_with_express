import express from "express";
import { todosControllers } from "./todos.controller";

const router = express.Router();

router.post("/", todosControllers.createTodos);
router.get("/", todosControllers.getTodo);
router.put("/:id", todosControllers.updateTodo)
router.delete("/:id", todosControllers.deleteTodo)

export const todosRoute = router;