import {Router} from 'express';
const router = Router();

import {
    follow,
    unfollow,
    getUserFriends,
    deleteFriends
} from '../controllers/friends.controller'
import { isAdminMiddleware } from '../middleware/admin';

// Friend Routes
router.get('/:id', getUserFriends)
router.delete('/', isAdminMiddleware, deleteFriends)
router.put('/follow', follow)
router.put('/unfollow', unfollow)

export default router