const express = require("express");
const router = express.Router();

const categoriesController = require("../controllers/categories");

router.get("/get-all-categories", categoriesController.getAllCategories);
router.post("/add-new-category", categoriesController.newCategory);
router.patch("/toggle-status", categoriesController.toggleStatus);
router.patch("/update-category-details", categoriesController.updateCategoryDetails);
router.delete("/delete-category", categoriesController.deleteCategory);

module.exports = router;
