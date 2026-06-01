export function isAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Cet accès ne vous est pas permis' });
    return;
  }
  next();
}
