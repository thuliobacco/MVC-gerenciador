const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskController');

router.get('/', controller.getAllTasks);
router.get('/:id', controller.getTaskById);
router.get('/:id/categories', controller.getCategoriesByTask);
router.post('/', controller.createTask);
router.post('/edit/:id', controller.updateTask);
router.post('/delete/:id', controller.deleteTask);

module.exports = router;