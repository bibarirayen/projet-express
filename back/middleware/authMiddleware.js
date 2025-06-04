const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }
  try {
    const decoded = jwt.verify(token, 'your_secret_key'); 
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token invalide" });
  }
};
