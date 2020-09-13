const user = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      alias: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      updatedAt: false,
    }
  );

  User.associate = (models) => {
    User.hasOne(models.UnopenedMessage, {
      foreignKey: 'user_id',
    });
    User.hasOne(models.Message, {
      foreignKey: 'user_id',
    });
    User.hasMany(models.Conversation, {
      as: 'firstUser',
      foreignKey: {
        name: 'first_user_id',
      }
    });
    User.hasMany(models.Conversation, {
      as: 'secondUser',
      foreignKey: {
        name: 'second_user_id',
      }
    })
  };

  return User;
};

export default user;
