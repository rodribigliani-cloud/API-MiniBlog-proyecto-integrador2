import pool from '../config.js';

const isMissing = (value) => value === undefined || value === null || String(value).trim() === '';

export const validateAuthorPayload = async (req, res, next) => {
    const { name, email } = req.body || {};

    if (isMissing(name) || isMissing(email)) {
        return res.status(400).json({ message: 'se requiere nombre y correo' });
}

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(String(email).trim())) {
        return res.status(400).json({ message: 'el correo no es valido' });
}

    try {
    const existing = await pool.query('SELECT id FROM authors WHERE email = $1', [String(email).trim()]);

    if (existing.rows.length > 0 && req.method !== 'PUT') {
        return res.status(409).json({ message: 'el correo ya existe' });
    }

    if (existing.rows.length > 0 && req.method === 'PUT') {
        const currentAuthor = await pool.query('SELECT id FROM authors WHERE id = $1', [req.params.id]);
        if (currentAuthor.rows.length === 0) {
        return res.status(404).json({ message: 'el autor no existe' });
    }

        if (Number(currentAuthor.rows[0].id) !== Number(existing.rows[0].id)) {
        return res.status(409).json({ message: 'el correo ya existe' });
    }
    }

    return next();
    } catch (error) {
    return next(error);
    }
};

export const validatePostPayload = async (req, res, next) => {
    const { title, content, author_id } = req.body || {};

    if (req.method === 'POST' && (isMissing(title) || isMissing(content) || isMissing(author_id))) {
    return res.status(400).json({ message: 'se requiere titulo, contenido y autor' });
}

    if (req.method === 'PUT') {
        if (title !== undefined && isMissing(title)) {
            return res.status(400).json({ message: 'el titulo no puede estar vacio' });
    }
    if (content !== undefined && isMissing(content)) {
            return res.status(400).json({ message: 'el contenido no puede estar vacio' });
    }
    if (author_id !== undefined && isMissing(author_id)) {
            return res.status(400).json({ message: 'el id del autor no puede estar vacio' });
    }
}

    if (author_id !== undefined && author_id !== null && author_id !== '') {
        try {
    const authorCheck = await pool.query('SELECT id FROM authors WHERE id = $1', [author_id]);
        if (authorCheck.rows.length === 0) {
        return res.status(404).json({ message: 'el autor no existe' });
    }
    } catch (error) {
        return next(error);
    }
}

    return next();
};

export const validateIdParam = (req, res, next) => {
    const { id, authorId } = req.params;
    const value = id ?? authorId;

    if (!value || Number.isNaN(Number(value))) {
        return res.status(400).json({ message: 'el id no es valido' });
    }

    return next();
};
