module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ProjectMember', {
    project_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'projects',
        key: 'id'
      },
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('member', 'manager'),
      defaultValue: 'member'
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
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
    timestamps: false, 
    underscored: true,
    tableName: 'project_members'
  });
};
