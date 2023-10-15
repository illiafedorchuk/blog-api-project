module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Comment.prototype.toJSON = function () {
    const comm = { ...this.get() };
    // Exclude sensitive fields
    delete comm.createdAt;
    delete comm.updatedAt;
    return comm;
  };
  return Comment;
};
