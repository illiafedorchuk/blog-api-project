const express = require("express");
const db = require("../models");
const Poster = db.Poster;
const Comment = db.Comment;
const User = db.User;
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync");
const factory = require("./controllerFactory");

// Create new comment
exports.createComment = factory.createOne(Comment);
// get all comments
exports.getAllComments = factory.getAll(Comment);
// get one comment
exports.getOneComment = factory.getOne(Comment);
// delete comment
exports.deleteComment = factory.deleteOne(Comment);
// update comment
exports.updateComment = factory.updateOne(Comment);

// get comment for post
exports.getCommentForPost = catchAsync(async (req, res) => {
  const comment = await Comment.findAll({
    where: {
      post_id: req.params.id,
    },
  });
  if (!comment) {
    res.status(404).json({
      status: "fail",
      message: "Comment not found",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: {
        comment,
      },
    });
  }
});
