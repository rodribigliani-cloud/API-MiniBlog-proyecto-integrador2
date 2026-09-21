import express from 'express';
import authorsRouter from '../routes/users.js';
import postsRouter from '../routes/post.js';
import errorHandler from '../middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    });
});

app.use('/authors', authorsRouter);
app.use('/posts', postsRouter);

app.use((req, res) => {
    res.status(404).json({ message: 'ruta no encontrada' });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}

export default app;