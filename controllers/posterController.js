const express = require("express");
const db = require("../models");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync");
const Poster = db.Poster;
const Comment = db.Comment;
const User = db.User;
const factory = require("./controllerFactory");

// Create new poster
exports.createPoster = factory.createOne(Poster);
// Get all posters
exports.getAllPosters = factory.getAll(Poster);
// Get one poster
exports.getOnePoster = factory.getOne(Poster);
// Update poster
exports.updatePoster = factory.updateOne(Poster);

// Delete poster
exports.deletePoster = catchAsync(async (req, res) => {
  const posterId = req.params.id;
  const poster = await Poster.findByPk(posterId);

  if (!poster) {
    return res.status(404).json({
      status: "fail",
      message: "Poster not found",
    });
  }

  const userId = req.user.id;
  const user = await User.findByPk(userId);
  console.log(user);
  if (poster.author == userId || user.role == "admin") {
    const comments = await Comment.findAll({
      where: {
        post_id: posterId,
      },
    });

    await Promise.all(
      comments.map(async (comment) => {
        await comment.destroy();
      })
    );

    await poster.destroy();

    res.status(204).json({
      status: "success",
      data: null,
    });
  }

  return res.status(401).json({
    status: "fail",
    message: "No access",
  });
});
