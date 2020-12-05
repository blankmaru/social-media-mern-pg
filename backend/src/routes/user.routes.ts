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
    uploadAvatar,
    uploadBg,
    setSocialAccounts
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
router.post('/accounts/:id', setSocialAccounts)

// User Image uploading routes
router.post('/uploadAvatar/:id', uploadAvatar)
router.post('/uploadBg/:id', uploadBg)

// Admin routes
router.get('/', getUsers)
// add admin middleware in prod mode
router.delete('/:id', isAdminMiddleware, deleteUser)

export default router