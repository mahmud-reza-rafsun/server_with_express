import { pool } from "../../config/database";
import bcrypt from "bcryptjs";

const createUsers = async (payload: Record<string, unknown>) => {
    const { name, email, password, role } = payload;
    const hashedPass = await bcrypt.hash(password as string, 10)
    const result = await pool.query(`INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING *`, [name, email, hashedPass, role]);
    return result;
}

const getUsers = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    return result;
}

const getSingleUser = async (id: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return result;
}

const updateUser = async (name: string, email: string, id: string) => {
    const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`, [name, email, id]);
    return result;
}

const deleteUser = async (id: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    return result;
}

export const userServices = {
    createUsers,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser
}