const express = require('express');
const router = express.Router();

// Página de teste
router.get('/teste', (req, res) => {
    res.render('pages/test');
});

// Página principal - Dashboard
router.get('/', (req, res) => {
    res.render('layout/main', {
        title: 'Dashboard - TaskFlow',
        page: 'dashboard'
    });
});

// Página de tarefas
router.get('/tarefas', (req, res) => {
    res.render('layout/main', {
        title: 'Tarefas - TaskFlow',
        page: 'tasks'
    });
});

// Página de usuários
router.get('/usuarios', (req, res) => {
    res.render('layout/main', {
        title: 'Usuários - TaskFlow',
        page: 'users'
    });
});

// Página de categorias
router.get('/categorias', (req, res) => {
    res.render('layout/main', {
        title: 'Categorias - TaskFlow',
        page: 'categories'
    });
});

// Rotas alternativas em inglês (para compatibilidade)
router.get('/tasks', (req, res) => res.redirect('/tarefas'));
router.get('/users', (req, res) => res.redirect('/usuarios'));
router.get('/categories', (req, res) => res.redirect('/categorias'));
router.get('/dashboard', (req, res) => res.redirect('/'));

module.exports = router;