export function errorHandler(err, req, res, next) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err);
  res.status(500).json({ message: 'Une erreur interne est survenue.' });
}