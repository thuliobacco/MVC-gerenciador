// Controller para debug e testes
const debugController = {
    // Teste simples
    testAPI: (req, res) => {
        res.json({
            status: 'success',
            message: 'API funcionando!',
            timestamp: new Date().toISOString(),
            endpoint: req.originalUrl
        });
    },

    // Retornar dados mockados para teste
    getMockTasks: (req, res) => {
        const mockTasks = [
            {
                id: 1,
                titulo: 'Tarefa de Teste 1',
                descricao: 'Primeira tarefa para testar o sistema',
                duracao: 60,
                created_at: new Date().toISOString(),
                update_at: new Date().toISOString()
            },
            {
                id: 2,
                titulo: 'Tarefa de Teste 2', 
                descricao: 'Segunda tarefa para verificar se funciona',
                duracao: 120,
                created_at: new Date().toISOString(),
                update_at: new Date().toISOString()
            },
            {
                id: 3,
                titulo: 'Tarefa de Teste 3',
                descricao: 'Terceira tarefa sem duração definida',
                duracao: null,
                created_at: new Date().toISOString(),
                update_at: new Date().toISOString()
            }
        ];

        res.json(mockTasks);
    },

    getMockUsers: (req, res) => {
        const mockUsers = [
            {
                id: 1,
                nome: 'João Silva',
                created_at: new Date().toISOString(),
                update_at: new Date().toISOString()
            },
            {
                id: 2,
                nome: 'Maria Santos',
                created_at: new Date().toISOString(),
                update_at: new Date().toISOString()
            }
        ];

        res.json(mockUsers);
    },

    getMockCategories: (req, res) => {
        const mockCategories = [
            {
                id: 1,
                titulo: 'Trabalho'
            },
            {
                id: 2,
                titulo: 'Pessoal'
            },
            {
                id: 3,
                titulo: 'Urgente'
            }
        ];

        res.json(mockCategories);
    },

    // Info do sistema
    getSystemInfo: (req, res) => {
        res.json({
            node_version: process.version,
            platform: process.platform,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            env: {
                NODE_ENV: process.env.NODE_ENV,
                PORT: process.env.PORT,
                DB_HOST: process.env.DB_HOST,
                DB_PORT: process.env.DB_PORT,
                DB_DATABASE: process.env.DB_DATABASE,
                // Não incluir senha por segurança
            }
        });
    }
};

module.exports = debugController;