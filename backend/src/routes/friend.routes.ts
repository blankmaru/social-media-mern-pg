import {Router} from 'express';
const router = Router();

import {
    follow
} from '../controllers/friends.controller'

// Friend Routes
router.put('/', follow)

export default router