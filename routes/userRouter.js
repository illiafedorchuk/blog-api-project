const express = require("express");
const router = express.Router();

const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.patch('/resetPassword/:token', authController.resetPassword);
router.post("/forgotPassword", authController.forgotPassword);


router.get('/myAccount',authController.protect, userController.getMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
router.route("/").get(userController.getAllUsers);
router.route("/:id").get(userController.getUserById);

router.use(authController.protect);

router.patch('/updateMe',userController.updateMe);





module.exports = router;
