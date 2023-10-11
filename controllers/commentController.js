const express = require("express");
const db = require("../models");
const Poster = db.Poster;
const Comment = db.Comment;
const User = db.User;
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync");

// Create new comment
exports.createComment = catchAsync(async (req, res, next) => {
  const poster = await Poster.findByPk(req.params.id);

  if (!poster) {
    return next(new AppError("No poster found with that ID", 404));
  }

  const user = req.user.id;
  console.log(user);
  const content = {
    post_id: poster.id,
    content: req.body.content,
    user_id: user,
  };

  const comment = await Comment.create(content);
  res.status(201).json({
    status: "success",
    message: "Comment created successfully",
  });
});

// get all comments

exports.getAllComments = catchAsync(async (req, res) => {
  const comments = await Comment.findAll({
    include: {
      model: User,
      as: "users",
    },
  });
  res.status(200).json({
    status: "success",
    results: comments.length,
    data: {
      comments,
    },
  });
});

// get one comment

exports.getOneComment = catchAsync(async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);
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

// get comment for post
exports.getCommentForPost = catchAsync(async (req, res) => {
  console.log(req.params.id);
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

// delete comment

exports.deleteComment = catchAsync(async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);
  const user = req.user.id;
  if (!comment || comment.user_id !== user) {
    res.status(404).json({
      status: "fail",
      message: "Cant find comment or you are not the author",
    });
  } else {
    await comment.destroy();
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
});

// update comment
exports.updateComment = catchAsync(async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);
  const user = req.user.id;
  if (!comment || comment.user_id !== user) {
    res.status(404).json({
      status: "fail",
      message: "Cant find comment or you are not the author",
    });
  } else {
    const updatedData = {
      content: req.body.content,
    };
    await comment.update(updatedData);
    res.status(200).json({
      status: "success",
      data: comment,
    });
  }
});