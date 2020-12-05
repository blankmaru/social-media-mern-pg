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
    updateUserInfo,
    uploadAvatar
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

// User Image uploading routes
router.post('/uploadAvatar/:id', uploadAvatar)

// Admin routes
router.get('/', getUsers)
// add admin middleware in prod mode
router.delete('/:id', isAdminMiddleware, deleteUser)

export default router