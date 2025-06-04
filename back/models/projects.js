module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Project', {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'completed', 'archived'),
      defaultValue: 'draft'
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      allowNull: false
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'projects'
  });
};
