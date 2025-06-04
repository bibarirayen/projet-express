const db = require('../models');
const User = db.User;
//voir tous les utilisateurs(filtrage selon role)
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll();
    const formattedUsers = users.map(user => {
      if (req.user.is_super_admin) {
        return user; 
      } else {
        return {
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          profile_image: user.profile_image
        };
      }
    });
    res.json(formattedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message || "Erreur lors de la récupération des utilisateurs." });
  }
};
//voir un utilisateur par id(filtrage selon role)
exports.findById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    if (req.user.is_super_admin || req.user.id === user.id) {
      return res.json(user);
    }
    res.json({
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      profile_image: user.profile_image
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Erreur lors de la récupération de l'utilisateur." });
  }
};
//mise a jour de profil utilisateur (seulement par l'utulisateur lui meme)
exports.update = async (req, res) => {
  const id = parseInt(req.params.id);
  if (!req.user || req.user.id !== id) {
    return res.status(403).json({ message: "Vous ne pouvez modifier que votre propre compte." });
  }
  try {
    if (req.body.username) {
      const existing = await User.findOne({ where: { username: req.body.username } });
      if (existing && existing.id !== id) {
        return res.status(400).json({ message: "Nom d'utilisateur déjà utilisé." });
      }
    }
    const [updated] = await User.update({
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      profile_image: req.body.profile_image
    }, { where: { id } });
    if (updated === 1) {
      res.json({ message: "Profil mis à jour avec succès." });
    } else {
      res.status(404).json({ message: `Impossible de mettre à jour l'utilisateur avec le username=${id}.` });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour.", error: err });
  }
};
//la suppression est interdite(meme pour le super admin)
exports.delete = async (req, res) => {
  return res.status(403).json({ message: "La suppression de compte utilisateur est interdite." });
};
