const express = require("express");
const router = express.Router();
const usersController = require('../controllers/users')
const { upload } = require('../helpers/multer')

router.post("/register", usersController.createNewUser);
router.post("/user-login", usersController.userLogin);

router.get("/get-all-users", usersController.getAllUsers);
router.get("/get-particular-user", usersController.getParticularUser);
router.delete("/delete-user", usersController.deleteUser);

router.post("/admin-login", usersController.adminLogin);
router.get("/get-admin-details", usersController.getAdminDetails);
router.patch("/update-admin-details", upload.single('image'), usersController.updateAdminDetails);
router.post("/create-admin", usersController.createadmin);
router.post("/business-login", usersController.BusinessLogin);

module.exports = router;