import {Router} from 'express';
const router = Router();

import {
    getUsers,
    register
} from '../controllers/user.controller'

router.get('/', getUsers)
router.post('/register', register)

export default router