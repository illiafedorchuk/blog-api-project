const express = require("express");
const db = require("../models");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync");
const Poster = db.Poster;
const Comment = db.Comment;

// Create new poster
exports.createPoster = catchAsync(async (req, res) => {
  const userId = req.user.id;
  
  if (!userId) {
    return new AppError("You are not authorized to create a poster", 500), {};
  }

  let content = {
    title: req.body.title,
    owner: true,
    author: userId,
    create_date: req.body.create_date,
    content: req.body.content,
    location: req.body.location,
    likes: req.body.likes,
  };

  const poster = await Poster.create(content);
  res.status(201).json({
    status: "success",
    message: "Poster created successfully",
  });
});

// Get all posters
exports.getAllPosters = async (req, res) => {
  const posters = await Poster.findAll({
    include: {
      model: Comment,
      as: "comments",
    },
  });
  res.status(200).json({
    status: "success",
    results: posters.length,
    data: {
      posters,
    },
  });
};

// Get one poster
exports.getOnePoster = catchAsync(async (req, res) => {
  const poster = await Poster.findByPk(req.params.id, {
    include: {
      model: Comment,
      as: "comments",
    },
  });
  res.status(200).json({
    status: "success",
    data: {
      poster,
    },
  });
});

exports.updatePoster = async (req, res) => {
  const posterId = req.params.id;
  const poster = await Poster.findByPk(posterId);
  const userId = req.user.id;
  console.log(userId);


  if (!poster) {
    return res.status(404).json({ message: "There is no post with that ID" });
  }

  if (userId != poster.author) {
    return res.status(401).json({ message: "No access" });
  }

  const updatedData = {
    location: req.body.location,
    title: req.body.title,
    content: req.body.content,
  };
  await poster.update(updatedData);
  res.status(200).json({
    message: "Success",
    data: poster,
  });
};

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

  if (poster.author !== userId) {
    return res.status(401).json({
      status: "fail",
      message: "No access",
    });
  }

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
});
