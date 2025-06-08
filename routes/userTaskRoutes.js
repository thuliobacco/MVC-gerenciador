const express = require("express");
const router = express.Router();
const controller = require("../controllers/userTaskController");

router.post("/", controller.createUserTask);
router.post("/delete/:id_user/:id_task", controller.deleteUserTask);

module.exports = router;
