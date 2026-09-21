import pool from '../config.js';

export const getPosts = async (req, res, next) => {
    try {
    const result = await pool.query(`
    SELECT p.*, a.name AS author_name, a.email AS author_email
    FROM posts p
    INNER JOIN authors a ON a.id = p.author_id
    ORDER BY p.id ASC
    `);

    res.status(200).json(result.rows);
    } catch (error) {
    next(error);
    }
};

export const getPostById = async (req, res, next) => {
    try {
    const { id } = req.params;
    const result = await pool.query(
        `SELECT p.*, a.name AS author_name, a.email AS author_email
        FROM posts p
        INNER JOIN authors a ON a.id = p.author_id
        WHERE p.id = $1`,
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'publicacion no encontrada' });
    }

    return res.status(200).json(result.rows[0]);
    } catch (error) {
    return next(error);
    }
};

export const getPostsByAuthor = async (req, res, next) => {
    try {
    const { authorId } = req.params;

    const authorResult = await pool.query('SELECT * FROM authors WHERE id = $1', [authorId]);

    if (authorResult.rows.length === 0) {
        return res.status(404).json({ message: 'Autor no encontrado' });
    }

    const postsResult = await pool.query(
        `SELECT p.*, a.name AS author_name, a.email AS author_email
        FROM posts p
        INNER JOIN authors a ON a.id = p.author_id
        WHERE p.author_id = $1
        ORDER BY p.id ASC`,
        [authorId]
    );

    return res.status(200).json({
        author: authorResult.rows[0],
        posts: postsResult.rows,
    });
    } catch (error) {
    return next(error);
    }
};

export const createPost = async (req, res, next) => {
    try {
    const { title, content, author_id, published } = req.body;

    if (!title || !content || !author_id) {
    return res.status(400).json({ message: 'title, content and author_id are required' });
    }

    const authorCheck = await pool.query('SELECT id FROM authors WHERE id = $1', [author_id]);
    if (authorCheck.rows.length === 0) {
    return res.status(404).json({ message: 'Autor no encontrado' });
    }

    const result = await pool.query(
    `INSERT INTO posts (title, content, author_id, published)
    VALUES ($1, $2, $3, $4)
       RETURNING *`,
    [title, content, author_id, published ?? false]
    );

    return res.status(201).json(result.rows[0]);
    } catch (error) {
    return next(error);
    }
};

export const updatePost = async (req, res, next) => {
    try {
    const { id } = req.params;
    const { title, content, author_id, published } = req.body;

    if (author_id) {
        const authorCheck = await pool.query('SELECT id FROM authors WHERE id = $1', [author_id]);
        if (authorCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Autor no encontrado' });
        }
    }

    const result = await pool.query(
        `UPDATE posts
        SET title = COALESCE($1, title),
        content = COALESCE($2, content),
        author_id = COALESCE($3, author_id),
        published = COALESCE($4, published)
        WHERE id = $5
        RETURNING *`,
        [title ?? null, content ?? null, author_id ?? null, published ?? null, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'publicacion no encontrada' });
    }

    return res.status(200).json(result.rows[0]);
    } catch (error) {
    return next(error);
    }
};

export const deletePost = async (req, res, next) => {
    try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
    return res.status(404).json({ message: 'publicacion no encontrada' });
    }

    return res.status(200).json({ message: 'publicacion eliminada exitosamente' });
    } catch (error) {
    return next(error);
    }
};
