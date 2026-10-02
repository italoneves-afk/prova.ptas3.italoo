export default function logger(req, res, next) {
  const inicio = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} - ${Date.now() - inicio}ms`);
  });
  next();
}