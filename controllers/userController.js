const express = require("express");
const db = require("../models");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync");
const factory = require("./controllerFactory");
const User = db.User;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Delete user
exports.deleteUser = factory.deleteOne(User);
// Get all users
exports.getAllUsers = factory.getAll(User);
// Get one user
exports.getUserById = factory.getOne(User);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Update user
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "username", "email");

  // Validate email format
  if (!emailRegex.test(req.body.email)) {
    return next(new AppError("Invalid email format", 400));
  }
  // 3) Find the user by their primary key (id)
  const user = await User.findByPk(req.user.id);

  // 4) Update the user's attributes
  if (user) {
    await user.update(filteredBody);
    // Optionally, you can refresh the user object with the updated data
    await user.reload();
  } else {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// Get current user
exports.getMe = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findByPk(userId);
  user.password = undefined;
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // 1) Find user based on id
  const user = await User.findByPk(req.user.id);

  // 2) Set active to false
  if (user) {
    await user.destroy();
  } else {
    return next(new AppError("User not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
