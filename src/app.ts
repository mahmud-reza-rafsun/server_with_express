import express, { Request, Response } from 'express';
import initDB from './config/database';
import logger from './middleware/logger';
import { userRoute } from './modules/users/user.route';
import { todosRoute } from './modules/todos/todos.route';
import { authRouter } from './modules/auth/auth.route';

export const app = express();


// parser 
app.use(express.json());

initDB();


app.get('/', (req: Request, res: Response) => {
    res.send("minimla server with express");
})

// CRUD route
app.use('/users', userRoute, logger)

// todos CRUD
app.use('/todos', todosRoute, logger)

// auth route
app.use("/auth", authRouter)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    })
})

export default app;