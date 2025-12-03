import express, { NextFunction, Request, response, Response } from 'express';
import { Pool } from "pg";
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), '.env') })

const app = express();
const port = 5000

// parser 
app.use(express.json());
// app.use(urlencoded())

// DB
const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STR}`
})

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            age INT,
            phone VARCHAR(15),
            address TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT false,
            due_date DATE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `);
};


initDB();

// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} \n`);
    next();
}

app.get('/', (req: Request, res: Response) => {
    res.send("minimla server with express");
})

// post CRUD
app.post('/users', async (req: Request, res: Response) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query(`INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`, [name, email]);
        res.status(200).json({
            success: false,
            message: "Data Inserted successfully...",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// get CRUD
app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM users`);
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// get single user
app.get('/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: result.rows[0],
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

app.put('/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`, [name, email, id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User update successfully",
                data: result.rows[0],
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

app.delete('/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
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
})

// todos CRUD

// post todos

app.post('/todos', async (req: Request, res: Response) => {
    const { user_id, title } = req.body;
    try {
        const result = await pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`, [user_id, title]);
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
})

app.get('/todos', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM todos`);
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
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    })
})


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})