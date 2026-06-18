import { getListOwner } from '../models/list-model.js';

export async function isListOwner(req, res, next) {
  const listId = Number(req.params.id);
  if (isNaN(listId)) {
    res.status(400).json({ message: "l'id est invalide" });
    return;
  }

  const ownerId = await getListOwner(listId);
  if (ownerId !== req.user.userId) {
    res.status(404).json({ message: 'La liste est introuvable' });
    return;
  }

  next();
}
