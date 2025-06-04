const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');
app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware.js');
const projectMembersRoutes = require('./routes/project_members');
app.use('/auth', authRoutes); // ✅ Register the /auth routes
app.use('/users', require('./routes/users'));
app.use('/projects', require('./routes/projects'));
app.use('/api/project-members', projectMembersRoutes);
app.use('/tasks', require('./routes/tasks'));
app.get('/', (req, res) => res.send('✅ API OK'));
db.sequelize.sync({ alter: true }).then(() => {
  console.log('🗂️ Database synced');
  app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
});
