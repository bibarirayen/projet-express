module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Task', {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('todo', 'in_progress', 'done', 'cancelled'),
      defaultValue: 'todo'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      allowNull: false
    },
    project_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'projects',
        key: 'id'
      },
      allowNull: false
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'tasks'
  });
};
