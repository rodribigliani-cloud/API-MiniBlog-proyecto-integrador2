import express from 'express';
import {
    getAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
} from '../controllers/authorsController.js';
import { validateAuthorPayload, validateIdParam } from '../middlewares/validate.js';

const router = express.Router();

router.get('/', getAuthors);
router.get('/:id', validateIdParam, getAuthorById);
router.post('/', validateAuthorPayload, createAuthor);
router.put('/:id', validateIdParam, validateAuthorPayload, updateAuthor);
router.delete('/:id', validateIdParam, deleteAuthor);

export default router;
