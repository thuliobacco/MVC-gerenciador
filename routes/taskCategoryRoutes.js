const express = require("express");
const router = express.Router();
const controller = require("../controllers/taskCategoryController");

router.post("/", controller.createTaskCategory);
router.post("/delete/:id_task/:id_category", controller.deleteTaskCategory);

module.exports = router;
