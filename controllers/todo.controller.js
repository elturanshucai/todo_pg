import pool from "../config/database.js"

export const createTodo = async (req, res) => {
    try {
        const userId = req.userId
        const todo = await (await pool.query('INSERT INTO todos (title, userid) VALUES ($1, $2) RETURNING *',
            [req.body.title, userId]
        )).rows[0]
        res.status(201).json(todo)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const updateTodo = async (req, res) => {
    try {
        const userid = req.userId;
        const todoId = req.params.id;
        const todo = await (await pool.query('SELECT * FROM todos where id = $1', [todoId])).rows[0]
        if (todo.userid != userid) return res.status(401).json('You can only update your own todo.');
        const updatedTodo = await (await pool.query(
            'UPDATE todos SET title = $1 where id = $2 RETURNING *', [req.body.title, todoId]
        )).rows[0]
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json(error)
    }
}

export const viewTodo = async (req, res) => {
    try {
        const todoId = req.params.id;
        const userId = req.userId;
        const todo = await (await pool.query(
            'SELECT * FROM todos where id = $1', [todoId]
        )).rows[0]
        if (todo.userid != userId) return res.status(401).json('You can only show your own todo.');
        res.status(200).json(todo)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getUserTodos = async (req, res) => {
    try {
        const userid = req.userId;
        const todoList = await pool.query(
            'SELECT * FROM todos where userid = $1', [userid]
        )
        res.status(200).json(todoList.rows)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteTodo = async (req, res) => {
    try {
        const userid = req.userId;
        const todoId = req.params.id;
        const todo = await (await pool.query(
            'SELECT * FROM todos where id = $1', [todoId]
        )).rows[0]
        if (!todo) return res.status(404).json('Todo not found');
        if (todo.userid != userid) return res.status(401).json('You can only delete your own todo.');
        await pool.query('DELETE FROM todos WHERE id=$1', [todoId])
        res.status(200).json('Todo deleted')
    } catch (error) {
        res.status(500).json(error)
    }
}