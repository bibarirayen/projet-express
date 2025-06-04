const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
//sign up
exports.register = async (req, res) => {
  const { username, email, password_hash, first_name, last_name, is_super_admin } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password_hash,
      first_name,
      last_name,
      is_super_admin: is_super_admin || false
    });
    res.status(201).json({ message: 'Utilisateur inscrit avec succès', user });
  } catch (err) {
    console.error('Erreur Sequelize brute :', err);
    res.status(500).json({ 
      message: "Erreur d'inscription", 
      error: err?.message || JSON.stringify(err) 
    });
  }
};
//login with jwt token
exports.login = async (req, res) => {
  const { email, password_hash } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || user.password_hash !== password_hash) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    //creer le token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        is_super_admin: user.is_super_admin
      },
      'your_secret_key',
      { expiresIn: '1h' }
    );
    res.status(200).json({
      message: 'Connexion réussie',
      token, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_super_admin: user.is_super_admin
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error: err });
  }
};
