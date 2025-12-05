import { Request, Response } from "express";
import { todosServices } from "./todos.service";

const createTodos = async (req: Request, res: Response) => {
    const { user_id, title } = req.body;
    try {
        const result = await todosServices.createTodos(user_id, title)
        res.status(200).json({
            success: false,
            message: "todos create successfully...",
            data: result.rows[0]
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const getTodo = async (req: Request, res: Response) => {
    try {
        const result = await todosServices.getTodo()
        res.status(200).json({
            success: true,
            message: "todos retrieved successfully",
            data: result.rows,
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateTodo = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { user_id, title } = req.body;

    try {
        const result = await todosServices.updateTodo(user_id, title, id as string);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Todos not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Todos update successfully",
                data: result.rows[0],
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteTodo = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await todosServices.deleteTodo(id as string)
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User delete successfully",
                data: result.rows[0],
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const todosControllers = {
    createTodos,
    getTodo,
    updateTodo,
    deleteTodo
}