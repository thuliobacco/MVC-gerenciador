const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// IMPORTANTE: Servir arquivos estáticos ANTES das rotas
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para debug de arquivos estáticos
app.use('/styles.css', (req, res, next) => {
    console.log('📄 Tentando carregar styles.css');
    next();
});

app.use('/main.js', (req, res, next) => {
    console.log('📄 Tentando carregar main.js');
    next();
});

// Log de requisições para desenvolvimento
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Importar rotas
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userTaskRoutes = require('./routes/userTaskRoutes');
const taskCategoryRoutes = require('./routes/taskCategoryRoutes');
const frontRoutes = require('./routes/frontRoutes');
const debugRoutes = require('./routes/debugRoutes');

// Middleware de log detalhado
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST' && req.body) {
        console.log('  Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Configurar rotas de debug PRIMEIRO
app.use('/debug', debugRoutes);

// Configurar rotas da API
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/categories', categoryRoutes);
app.use('/user-task', userTaskRoutes);
app.use('/task-category', taskCategoryRoutes);

// Configurar rotas do frontend
app.use('/', frontRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err);
    
    // Se é uma requisição de API (JSON)
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
        });
    } else {
        // Se é uma requisição de página
        res.status(500).render('layout/main', {
            title: 'Erro - Gerenciador de Tarefas',
            body: `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Erro interno do servidor</h3>
                    <p>Ocorreu um erro inesperado. Tente novamente em alguns instantes.</p>
                    <a href="/" class="btn btn-primary">Voltar ao início</a>
                </div>
            `
        });
    }
});

// Middleware para páginas não encontradas
app.use((req, res) => {
    // Se é uma requisição de API
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        res.status(404).json({ 
            error: 'Endpoint não encontrado',
            message: `A rota ${req.method} ${req.url} não existe`
        });
    } else {
        // Se é uma requisição de página
        res.status(404).render('layout/main', {
            title: 'Página não encontrada - Gerenciador de Tarefas',
            body: `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>Página não encontrada</h3>
                    <p>A página que você está procurando não existe.</p>
                    <a href="/" class="btn btn-primary">Voltar ao início</a>
                </div>
            `
        });
    }
});

// Inicializar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`📚 API disponível em: http://localhost:${PORT}/tasks, /users, /categories`);
    console.log(`🎨 Interface web disponível em: http://localhost:${PORT}/`);
});

module.exports = app;