const { Pool } = require('pg');
require('dotenv').config();

// Configuração do banco de dados com os parâmetros corretos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'gerenciador_tarefas',
    // SSL apenas em produção ou se especificamente habilitado
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    // Configurações de pool de conexões
    max: 20, // máximo de conexões no pool
    idleTimeoutMillis: 30000, // tempo limite para conexões inativas
    connectionTimeoutMillis: 2000, // tempo limite para nova conexão
};

// Criar pool de conexões
const pool = new Pool(dbConfig);

// Log de configuração (sem mostrar a senha)
console.log('🔗 Configuração do banco de dados:');
console.log(`   Host: ${dbConfig.host}`);
console.log(`   Port: ${dbConfig.port}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   User: ${dbConfig.user}`);
console.log(`   SSL: ${dbConfig.ssl ? 'Habilitado' : 'Desabilitado'}`);

// Testar conexão inicial
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Erro ao conectar com o banco de dados:', err.message);
        console.error('   Verifique as configurações no arquivo .env');
        process.exit(1);
    } else {
        console.log('✅ Conexão com banco de dados estabelecida com sucesso!');
        release();
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('🔄 Fechando pool de conexões...');
    pool.end(() => {
        console.log('✅ Pool de conexões fechado.');
        process.exit(0);
    });
});

module.exports = pool;