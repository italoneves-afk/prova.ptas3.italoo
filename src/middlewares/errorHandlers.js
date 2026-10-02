export function notFound(req, res, next) {
  const erro = new Error(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
  erro.status = 404;
  next(erro);
}

export function errorHandler(erro, req, res, next) {
  if (res.headersSent) {
    return next(erro);
  }

  const status = Number.isInteger(erro.status) ? erro.status : 500;
  res.status(status).json({ erro: erro.message || 'Erro interno do servidor.' });
}