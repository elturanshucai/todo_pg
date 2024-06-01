import express from 'express'
import { createTodo, deleteTodo, getUserTodos, updateTodo, viewTodo } from '../controllers/todo.controller.js';
import { verifyUser } from '../middlewares/verifyUser.js';

const router = express.Router()

router.post('/create', verifyUser, createTodo)
router.put('/update/:id', verifyUser, updateTodo)
router.get('/view/:id', verifyUser, viewTodo)
router.get('/all', verifyUser, getUserTodos)
router.delete('/delete/:id', verifyUser, deleteTodo)

export default router;