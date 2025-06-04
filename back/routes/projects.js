const express = require('express');
const router = express.Router();
const projectController = require('../controller/projects');
const auth = require('../middleware/authMiddleware'); // ✅ import middleware
// ✅ Appliquer le middleware à chaque route
router.post('/', auth, projectController.create);         // Créer un projet
router.get('/', auth, projectController.findAll);         // Voir tous les projets
router.get('/:projectId', auth, projectController.findById); // Voir un projet
router.put('/:projectId', auth, projectController.update);   // Modifier un projet
router.delete('/:projectId', auth, projectController.delete); // Supprimer un projet
module.exports = router;
