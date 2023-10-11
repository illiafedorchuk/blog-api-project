const express = require("express");
const router = express.Router();

const posterController = require("./../controllers/posterController");
const authController = require("./../controllers/authController");

router
  .route("/")
  .post(authController.protect, posterController.createPoster)
  .get(posterController.getAllPosters);

router
  .route("/:id")
  .get(posterController.getOnePoster)
  .patch(authController.protect, posterController.updatePoster)
  .delete(authController.protect, posterController.deletePoster);

module.exports = router;
