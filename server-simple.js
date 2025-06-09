const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IMPORTANTE: Servir arquivos estáticos com MIME types corretos
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// ========================================
// DADOS EM MEMÓRIA (sem banco por enquanto)
// ========================================
let dados = {
    tarefas: [
        { id: 1, titulo: 'Fazer compras', descricao: 'Ir ao mercado comprar frutas', duracao: 30, criado_em: new Date() },
        { id: 2, titulo: 'Estudar JavaScript', descricao: 'Revisar conceitos de async/await', duracao: 120, criado_em: new Date() },
        { id: 3, titulo: 'Exercitar-se', descricao: 'Correr no parque por 30 minutos', duracao: 30, criado_em: new Date() }
    ],
    usuarios: [
        { id: 1, nome: 'João Silva', criado_em: new Date() },
        { id: 2, nome: 'Maria Santos', criado_em: new Date() }
    ],
    categorias: [
        { id: 1, titulo: 'Pessoal' },
        { id: 2, titulo: 'Trabalho' },
        { id: 3, titulo: 'Estudos' }
    ]
};

let proximoId = {
    tarefas: 4,
    usuarios: 3,
    categorias: 4
};

// ========================================
// ROTAS DA API (JSON)
// ========================================

// TAREFAS
app.get('/api/tarefas', (req, res) => {
    console.log('📋 GET /api/tarefas - Retornando', dados.tarefas.length, 'tarefas');
    res.json(dados.tarefas);
});

app.post('/api/tarefas', (req, res) => {
    console.log('➕ POST /api/tarefas - Dados recebidos:', req.body);
    
    const { titulo, descricao, duracao } = req.body;
    
    if (!titulo) {
        return res.status(400).json({ erro: 'Título é obrigatório' });
    }
    
    const novaTarefa = {
        id: proximoId.tarefas++,
        titulo,
        descricao: descricao || '',
        duracao: parseInt(duracao) || null,
        criado_em: new Date()
    };
    
    dados.tarefas.push(novaTarefa);
    console.log('✅ Tarefa criada:', novaTarefa);
    res.status(201).json(novaTarefa);
});

app.put('/api/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { titulo, descricao, duracao } = req.body;
    
    console.log(`✏️ PUT /api/tarefas/${id} - Atualizando tarefa`);
    
    const indice = dados.tarefas.findIndex(t => t.id === id);
    if (indice === -1) {
        return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }
    
    dados.tarefas[indice] = {
        ...dados.tarefas[indice],
        titulo,
        descricao: descricao || '',
        duracao: parseInt(duracao) || null
    };
    
    console.log('✅ Tarefa atualizada:', dados.tarefas[indice]);
    res.json(dados.tarefas[indice]);
});

app.delete('/api/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`🗑️ DELETE /api/tarefas/${id} - Excluindo tarefa`);
    
    const indice = dados.tarefas.findIndex(t => t.id === id);
    if (indice === -1) {
        return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }
    
    dados.tarefas.splice(indice, 1);
    console.log('✅ Tarefa excluída');
    res.json({ sucesso: true });
});

// USUÁRIOS
app.get('/api/usuarios', (req, res) => {
    console.log('👥 GET /api/usuarios - Retornando', dados.usuarios.length, 'usuários');
    res.json(dados.usuarios);
});

app.post('/api/usuarios', (req, res) => {
    const { nome } = req.body;
    
    if (!nome) {
        return res.status(400).json({ erro: 'Nome é obrigatório' });
    }
    
    const novoUsuario = {
        id: proximoId.usuarios++,
        nome,
        criado_em: new Date()
    };
    
    dados.usuarios.push(novoUsuario);
    console.log('✅ Usuário criado:', novoUsuario);
    res.status(201).json(novoUsuario);
});

app.delete('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = dados.usuarios.findIndex(u => u.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    
    dados.usuarios.splice(indice, 1);
    console.log('✅ Usuário excluído');
    res.json({ sucesso: true });
});

// CATEGORIAS
app.get('/api/categorias', (req, res) => {
    console.log('🏷️ GET /api/categorias - Retornando', dados.categorias.length, 'categorias');
    res.json(dados.categorias);
});

app.post('/api/categorias', (req, res) => {
    const { titulo } = req.body;
    
    if (!titulo) {
        return res.status(400).json({ erro: 'Título é obrigatório' });
    }
    
    const novaCategoria = {
        id: proximoId.categorias++,
        titulo
    };
    
    dados.categorias.push(novaCategoria);
    console.log('✅ Categoria criada:', novaCategoria);
    res.status(201).json(novaCategoria);
});

app.delete('/api/categorias/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = dados.categorias.findIndex(c => c.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ erro: 'Categoria não encontrada' });
    }
    
    dados.categorias.splice(indice, 1);
    console.log('✅ Categoria excluída');
    res.json({ sucesso: true });
});

// ========================================
// ROTAS DO FRONTEND (HTML)
// ========================================

app.get('/', (req, res) => {
    res.render('dashboard', { 
        titulo: 'TaskFlow - Dashboard',
        totalTarefas: dados.tarefas.length,
        totalUsuarios: dados.usuarios.length,
        totalCategorias: dados.categorias.length,
        tarefasRecentes: dados.tarefas.slice(-3).reverse()
    });
});

app.get('/tarefas', (req, res) => {
    res.render('tarefas', { 
        titulo: 'TaskFlow - Tarefas',
        tarefas: dados.tarefas 
    });
});

app.get('/usuarios', (req, res) => {
    res.render('usuarios', { 
        titulo: 'TaskFlow - Usuários',
        usuarios: dados.usuarios 
    });
});

app.get('/categorias', (req, res) => {
    res.render('categorias', { 
        titulo: 'TaskFlow - Categorias',
        categorias: dados.categorias 
    });
});

// Página de teste
app.get('/teste', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Teste - TaskFlow</title>
            <style>
                body { 
                    background: linear-gradient(45deg, #667eea, #764ba2); 
                    color: white; 
                    font-family: Arial; 
                    padding: 2rem; 
                    text-align: center;
                }
                .card { 
                    background: white; 
                    color: #333; 
                    padding: 2rem; 
                    border-radius: 15px; 
                    margin: 1rem auto; 
                    max-width: 500px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }
                .btn { 
                    background: #667eea; 
                    color: white; 
                    border: none; 
                    padding: 1rem 2rem; 
                    border-radius: 25px; 
                    margin: 0.5rem;
                    cursor: pointer;
                    font-size: 1rem;
                }
                .btn:hover { 
                    background: #5a67d8; 
                    transform: scale(1.05);
                }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🚀 TaskFlow - Teste OK!</h1>
                <p>Se você está vendo esta página colorida, tudo funcionando!</p>
                <button class="btn" onclick="alert('JavaScript OK!')">Testar JS</button>
                <button class="btn" onclick="window.location.href='/'">Ir para Dashboard</button>
                <button class="btn" onclick="testarAPI()">Testar API</button>
                <div id="resultado"></div>
            </div>
            <script>
                async function testarAPI() {
                    try {
                        const response = await fetch('/api/tarefas');
                        const tarefas = await response.json();
                        document.getElementById('resultado').innerHTML = 
                            '<p style="color: green;">✅ API funcionando! ' + tarefas.length + ' tarefas encontradas</p>';
                    } catch (error) {
                        document.getElementById('resultado').innerHTML = 
                            '<p style="color: red;">❌ Erro na API: ' + error.message + '</p>';
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// ========================================
// INICIALIZAR SERVIDOR
// ========================================

app.listen(PORT, () => {
    console.log('🚀 ====================================');
    console.log('🎯 TaskFlow - Servidor Simplificado');
    console.log('🚀 ====================================');
    console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
    console.log(`🧪 Página de teste: http://localhost:${PORT}/teste`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/`);
    console.log(`📋 Tarefas: http://localhost:${PORT}/tarefas`);
    console.log('💾 Usando dados em memória (sem banco de dados)');
    console.log('🚀 ====================================');
});

module.exports = app;