module.exports = (sequelize, DataTypes) => {
  const Poster = sequelize.define("Poster", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
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
    location: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    likes: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
  });
  return Poster;
};
