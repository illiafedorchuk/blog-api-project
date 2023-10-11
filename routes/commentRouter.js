const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const commentController = require("./../controllers/commentController");

router.route("/").get(commentController.getAllComments);

router.get("/:id/post-comments", commentController.getCommentForPost);

router
  .route("/:id")
  .get(commentController.getOneComment)
  .delete(authController.protect, commentController.deleteComment)
  .post(authController.protect, commentController.createComment)
  .patch(authController.protect, commentController.updateComment);
module.exports = router;
