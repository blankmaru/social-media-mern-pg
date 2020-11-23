import {Router} from 'express';
const router = Router();

import {
    getPosts,
    addPost,
    updatePost,
    deletePost
} from '../controllers/post.controller'

// Post Routes
router.get('/', getPosts)
router.post('/', addPost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)

export default router