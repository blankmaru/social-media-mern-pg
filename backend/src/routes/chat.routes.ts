import {Router} from 'express';
const router = Router();

import {
    getChats,
    createChat
} from '../controllers/chat.controller'

// Chat Routes
router.get('/', getChats)
router.post('/', createChat)

export default router