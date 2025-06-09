// Configuração para ambiente de testes
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'gerenciador_tarefas_test';
process.env.PORT = 3001;

// Configurar timeouts para testes
jest.setTimeout(10000);

// Supressão de logs durante os testes
const originalConsole = console;

beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
});

afterAll(() => {
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
});

// Mock de variáveis de ambiente se necessário
if (!process.env.DB_HOST) {
    process.env.DB_HOST = 'localhost';
    process.env.DB_USER = 'postgres';
    process.env.DB_PASSWORD = 'password';
    process.env.DB_PORT = '5432';
}

// Funções utilitárias para testes
global.testUtils = {
    createTestUser: async (name = 'Test User') => {
        // Implementar criação de usuário de teste
        return {
            id: Math.floor(Math.random() * 1000),
            nome: name,
            created_at: new Date(),
            update_at: new Date()
        };
    },
    
    createTestTask: async (title = 'Test Task') => {
        // Implementar criação de tarefa de teste
        return {
            id: Math.floor(Math.random() * 1000),
            titulo: title,
            descricao: 'Test description',
            duracao: 60,
            created_at: new Date(),
            update_at: new Date()
        };
    },
    
    createTestCategory: async (title = 'Test Category') => {
        // Implementar criação de categoria de teste
        return {
            id: Math.floor(Math.random() * 1000),
            titulo: title
        };
    },
    
    cleanupTestData: async () => {
        // Implementar limpeza de dados de teste
        console.log('Cleaning up test data...');
    }
};

// Configuração para banco de dados de teste
global.testConfig = {
    database: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    }
};