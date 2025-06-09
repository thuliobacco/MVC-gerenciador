const express = require('express');
const router = express.Router();
const debugController = require('../controllers/debugController');

// Rotas de teste e debug
router.get('/test', debugController.testAPI);
router.get('/info', debugController.getSystemInfo);

// Dados mockados para teste
router.get('/mock/tasks', debugController.getMockTasks);
router.get('/mock/users', debugController.getMockUsers);
router.get('/mock/categories', debugController.getMockCategories);

module.exports = router;