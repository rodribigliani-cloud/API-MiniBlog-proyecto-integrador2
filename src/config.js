import pg from 'pg';

const { Pool } = pg;

const connectionConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
    }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        database: process.env.DB_NAME || 'miniblog_db',
        user: process.env.DB_USER || 'miniblog_user',
        password: process.env.DB_PASSWORD || 'admin',
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
    };

const pool = new Pool(connectionConfig);

export default pool;