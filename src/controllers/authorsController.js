import pool from '../config.js';

export const getAuthors = async (req, res, next) => {
    try {
    const result = await pool.query('SELECT * FROM authors ORDER BY id ASC');
    res.status(200).json(result.rows);
    } catch (error) {
    next(error);
    }
};

export const getAuthorById = async (req, res, next) => {
    try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(result.rows[0]);
    } catch (error) {
    return next(error);
 }
};

export const createAuthor = async (req, res, next) => {
    try {
    const { name, email, bio } = req.body;

    if (!name || !email) {
    return res.status(400).json({ message: 'name and email are required' });
    }

    const result = await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
    [name, email, bio || null]
    );

    return res.status(201).json(result.rows[0]);
} catch (error) {
    if (error.code === '23505') {
    return res.status(409).json({ message: 'Email already exists' });
    }
    return next(error);
}
};

export const updateAuthor = async (req, res, next) => {
    try {
    const { id } = req.params;
    const { name, email, bio } = req.body;

    const result = await pool.query(
    `UPDATE authors
    SET name = COALESCE($1, name),
        email = COALESCE($2, email),
        bio = COALESCE($3, bio)
        WHERE id = $4
       RETURNING *`,
    [name ?? null, email ?? null, bio ?? null, id]
    );

    if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(result.rows[0]);
    } catch (error) {
    if (error.code === '23505') {
    return res.status(409).json({ message: 'Email already exists' });
    }
    return next(error);
    }
};

export const deleteAuthor = async (req, res, next) => {
    try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM authors WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json({ message: 'Author deleted successfully' });
} catch (error) {
    return next(error);
    }
};
