import pool from '../config/database.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body
        const hashedPassword = await bcryptjs.hash(password, 10)
        const data = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        )
        const token = jwt.sign({ id: data.rows[0].id }, process.env.JWT_SECRET)
        const { password: pass, ...userInfo } = data.rows[0]
        userInfo.token = token
        res.status(201).json(userInfo)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await (await pool.query('SELECT * FROM users where username = $1', [username])).rows[0]
        const passwordExists = bcryptjs.compareSync(password, user.password)
        if (passwordExists) {
            const { password, ...userInfo } = user;
            const token = jwt.sign({ id: userInfo.id }, process.env.JWT_SECRET)
            userInfo.token = token
            res.status(200).json(userInfo)
        } else {
            res.status(401).json('Unauthorized')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}