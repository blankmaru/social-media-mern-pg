import {Router} from 'express';
const router = Router();

import {
    getPeoples,
    getImages
} from '../controllers/news.controller'

// News Routes
router.get('/peoples', getPeoples)
router.get('/images', getImages)

export default router