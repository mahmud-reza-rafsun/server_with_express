import { pool } from "../../config/database"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import config from "../../config";

const loginUser = async (email: string, password: string) => {
    console.log({ email });
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

    console.log(result);
    if (result.rows.length === 0) {
        return null
    }
    const user = result.rows[0];
    const isMatch = bcrypt.compare(password, user.password);

    console.log({ isMatch, user });

    if (!isMatch) {
        return false;
    }

    const token = jwt.sign({ name: user?.name, email: user?.email, role: user?.role }, config.jwtSecret as string, { expiresIn: '7d' });
    console.log({ token });
    return { token, user }
}

export const authServices = {
    loginUser,
}