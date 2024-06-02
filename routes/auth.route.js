import express from 'express'
import { deleteUser, login, registerUser } from '../controllers/auth.controller.js';
import { verifyUser } from '../middlewares/verifyUser.js';

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', login)
router.delete('/delete', verifyUser, deleteUser)

export default router;