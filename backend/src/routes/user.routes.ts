import {Router} from 'express';
const router = Router();
import passport from 'passport'

import {
    getUsers,
    register,
    login,
    user,
    logOut,
    deleteUser
} from '../controllers/user.controller'
import { isAdminMiddleware } from '../middleware/admin';

// Auth routes
router.post('/register', register)
router.post('/login', passport.authenticate('local'), login)
router.get('/user', user)
router.get('logOut', logOut)

// Admin routes
router.get('/', isAdminMiddleware, getUsers)
router.delete('/:id', isAdminMiddleware, deleteUser)

export default router