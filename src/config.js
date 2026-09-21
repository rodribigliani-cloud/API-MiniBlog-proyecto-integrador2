import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'miniblog_db',
    user: process.env.DB_USER || 'miniblog_user',
    password: process.env.DB_PASSWORD || 'admin',
});

export default pool;