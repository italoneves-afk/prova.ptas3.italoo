import express from 'express';
import { fileURLToPath } from 'node:url';
import emprestimoRoutes from './routes/emprestimoRoutes.js';
import logger from './middlewares/logger.js';
import { errorHandler, notFound } from './middlewares/errorHandlers.js';

const app = express();
const porta = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);
app.use(express.static(fileURLToPath(new URL('../public', import.meta.url))));
app.use('/emprestimos', emprestimoRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(porta, () => {
  console.log(`API de empréstimos disponível em http://localhost:${porta}`);
});