export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
}
export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err?.code === 11000) return res.status(409).json({ message: 'That value is already registered.' });
  if (err?.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join('. ') });
  if (err?.name === 'CastError') return res.status(400).json({ message: 'Invalid ID format.' });
  res.status(err.status || 500).json({ message: err.status ? err.message : 'Something went wrong on the server.' });
}
