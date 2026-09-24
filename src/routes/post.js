import express from 'express';
import {
    getPosts,
    getPostById,
    getPostsByAuthor,
    createPost,
    updatePost,
    deletePost,
} from '../controllers/postsController.js';
import { validateIdParam, validatePostPayload } from '../middlewares/validate.js';

const router = express.Router();

router.get('/author/:authorId', validateIdParam, getPostsByAuthor);
router.get('/', getPosts);
router.get('/:id', validateIdParam, getPostById);
router.post('/', validatePostPayload, createPost);
router.put('/:id', validateIdParam, validatePostPayload, updatePost);
router.delete('/:id', validateIdParam, deletePost);

export default router;