import jwt from 'jsonwebtoken'
import pool from '../config/database.js';

export const verifyUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) return res.status(401).json('Unauthorized');
        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
            if (err) return res.status(403).json('Token is not valid');
            const user = await (await pool.query('SELECT * FROM users where id = $1', [data.id])).rows[0]
            if (!user) return res.status(404).json('User not found');
            req.userId = data.id
            next();
        })
    } catch (error) {
        res.status(500).json(error)
    }
}