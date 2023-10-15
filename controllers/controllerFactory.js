const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const db = require("../models");
const Poster = db.Poster;
const Comment = db.Comment;
const User = db.User;

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByPk(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    // Check if the user is an admin
    if (req.user.role == "admin" || doc.author == req.user.id) {
      await doc.destroy();
      res.status(204).json({
        status: "success",
        data: null,
      });
    }
    return next(
      new AppError("You do not have permission to delete this document", 401)
    );
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByPk(req.params.id);
    const userId = req.user.id;

    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: "Cannot find the document with that ID",
      });
    }

    if (userId !== doc.author) {
      return res.status(401).json({
        status: "fail",
        message: "No access",
      });
    }

    const updatedData = {
      content: req.body.content,
      title: req.body.title,
      location: req.body.location,
    };
    const updatedDoc = await doc.update(updatedData);

    res.status(200).json({
      status: "success",
      data: updatedDoc,
    });
  });

// Create a new document
exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const userId = req.user.id;
    console.log(userId);
    if (req.params.id) {
      const poster = await Poster.findByPk(req.params.id);
      console.log(poster);
      if (!poster) {
        return res.status(404).json({
          status: "fail",
          message: "Cannot find the post with that ID",
        });
      }
    }

    const data = {
      post_id: req.params.id,
      content: req.body.content,
      author: userId,
      title: req.body.title,
      location: req.body.location,
    };

    const doc = await Model.create(data);
    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

// Get all documents
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
  
    const docs = await Model.findAll();
    if(!docs) {
      return next(new AppError("No documents found", 404));
    }
    
    // Check if Model is Poster
    if (Model === Poster) {
      const posters = await Poster.findAll({
        include: {
          model: Comment,
          as: "comments",
        },
      });

      // If it's a Poster, include the comments
      res.status(200).json({
        status: "success",
        results: docs.length,
        data: {
          docs: posters, // Include the posters with comments
        },
      });
    } else {
      // For other Models, simply return the documents
      res.status(200).json({
        status: "success",
        results: docs.length,
        data: {
          docs,
        },
      });
    }
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByPk(req.params.id);
    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: "Cannot find the document with that ID",
      });
    }
    if (Model === Poster) {
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
    }
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });
