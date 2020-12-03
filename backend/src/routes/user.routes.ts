import {Router} from 'express';
const router = Router();
import passport from 'passport'

import {
    getUsers,
    register,
    login,
    user,
    logOut,
    deleteUser,
    getUser,
    updateUserInfo
} from '../controllers/user.controller'
import { isAdminMiddleware } from '../middleware/admin';

// Auth routes
router.post('/register', register)
router.post('/login', passport.authenticate('local'), login)
router.get('/user', user)
router.get('/logOut', logOut)

// User routes
router.get('/:username', getUser)
router.put('/:id', updateUserInfo)

// Admin routes
router.get('/', getUsers)
// add admin middleware in prod mode
router.delete('/:id', deleteUser)

export default router