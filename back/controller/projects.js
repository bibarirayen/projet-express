const db = require('../models');
const Project = db.Project;
const ProjectMember = db.ProjectMember;
const User = db.User;
//creer un projet(utilisateur normal)
exports.create = async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = await Project.create({
      title,
      description,
      created_by: req.user.id
    });
    //le createur est automatiquement manager du projet
    await ProjectMember.create({
      project_id: project.id,
      user_id: req.user.id,
      role: 'manager',
      created_by: req.user.id
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création du projet", error: err });
  }
};
//voir tous les projets(filtres par rôle)
exports.findAll = async (req, res) => {
  try {
    let projects;
    if (req.user.is_super_admin) {
      projects = await Project.findAll({
        include: [{ model: User, as: 'owner', attributes: ['id', 'username'] }]
      });
    } else {
      const memberships = await ProjectMember.findAll({
        where: { user_id: req.user.id },
        attributes: ['project_id']
      });
      const memberProjectIds = memberships.map(pm => pm.project_id);
      const allProjects = await Project.findAll({
        include: [{ model: User, as: 'owner', attributes: ['username'] }]
      });
      projects = allProjects.map(p => {
        if (memberProjectIds.includes(p.id) || p.created_by === req.user.id) {
          const { id, ...projectWithoutId } = p.toJSON();
          return projectWithoutId;
        } else {
          return {
            title: p.title,
            description: p.description,
            status: p.status
          };
        }
      });
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des projets", error: err });
  }
};
//voir un projet par id
exports.findById = async (req, res) => {
  const id = parseInt(req.params.projectId);
  try {
    const project = await Project.findByPk(id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'username'] }]
    });
    if (!project) return res.status(404).json({ message: "Projet introuvable." });
    const isOwner = project.created_by === req.user.id;
    const isMember = await ProjectMember.findOne({
      where: { project_id: id, user_id: req.user.id }
    });
    if (req.user.is_super_admin) {
      return res.json(project);
    } else if (isOwner || isMember) {
      const { id, created_by, ...projectWithoutId } = project.toJSON();
      return res.json(projectWithoutId);
    } else {
      return res.json({
        title: project.title,
        description: project.description,
        status: project.status
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'accès au projet", error: err });
  }
};
//modifier un projet(createur uniquement)
exports.update = async (req, res) => {
  const id = parseInt(req.params.projectId);
  try {
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ message: "Projet introuvable." });
    if (project.created_by !== req.user.id) {
      return res.status(403).json({ message: "Accès refusé. Vous n'êtes pas le créateur." });
    }
    await Project.update({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status
    }, {
      where: { id }
    });
    res.json({ message: "Projet mis à jour avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la modification du projet", error: err });
  }
};
//supprimer un projet(createur uniquement)
exports.delete = async (req, res) => {
  const id = parseInt(req.params.projectId);
  try {
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ message: "Projet introuvable." });
    if (project.created_by !== req.user.id) {
      return res.status(403).json({ message: "Suppression interdite. Vous n'êtes pas le créateur." });
    }
    await Project.destroy({ where: { id } });
    res.json({ message: "Projet supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression du projet", error: err });
  }
};
