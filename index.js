import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/auth.route.js'
import todoRoutes from './routes/todo.route.js'
import pool from './config/database.js'

const port = 8000
const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/todo', todoRoutes)

app.listen(port, () => {
    console.log(`App running on ${port} port`)
})