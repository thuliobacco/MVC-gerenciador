#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 ====================================');
console.log('🎯 TaskFlow - Setup Automático');
console.log('🚀 ====================================');

// Verificar se Node.js está instalado
try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Node.js encontrado: ${nodeVersion}`);
} catch (error) {
    console.error('❌ Node.js não encontrado! Instale Node.js 14+ primeiro.');
    process.exit(1);
}

// Verificar se estamos na pasta correta
const requiredFiles = ['server-simple.js', 'package.json'];
const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
    console.log('⚠️  Arquivos necessários não encontrados:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
    console.log('');
    console.log('📋 Certifique-se de ter os seguintes arquivos:');
    console.log('   📄 server-simple.js');
    console.log('   📄 package.json');
    console.log('   📁 views/');
    console.log('      ├── dashboard.ejs');
    console.log('      ├── tarefas.ejs');
    console.log('      ├── usuarios.ejs');
    console.log('      └── categorias.ejs');
    process.exit(1);
}

// Verificar se a pasta views existe
if (!fs.existsSync('views')) {
    console.log('📁 Criando pasta views...');
    fs.mkdirSync('views');
}

// Verificar arquivos EJS
const ejsFiles = ['dashboard.ejs', 'tarefas.ejs', 'usuarios.ejs', 'categorias.ejs'];
const missingEjs = ejsFiles.filter(file => !fs.existsSync(path.join('views', file)));

if (missingEjs.length > 0) {
    console.log('⚠️  Arquivos EJS não encontrados:');
    missingEjs.forEach(file => console.log(`   - views/${file}`));
    console.log('');
    console.log('💡 Copie os arquivos EJS fornecidos para a pasta views/');
    process.exit(1);
}

console.log('✅ Todos os arquivos necessários encontrados!');
console.log('');

// Instalar dependências
console.log('📦 Instalando dependências...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependências instaladas com sucesso!');
} catch (error) {
    console.error('❌ Erro ao instalar dependências:', error.message);
    process.exit(1);
}

console.log('');
console.log('🎯 ====================================');
console.log('✅ Setup concluído com sucesso!');
console.log('🎯 ====================================');
console.log('');
console.log('🚀 Para executar o sistema:');
console.log('   npm start');
console.log('');
console.log('🌐 Acessar sistema:');
console.log('   http://localhost:3000');
console.log('');
console.log('🧪 Página de teste:');
console.log('   http://localhost:3000/teste');
console.log('');
console.log('📋 Páginas disponíveis:');
console.log('   🏠 Dashboard:   http://localhost:3000/');
console.log('   📝 Tarefas:     http://localhost:3000/tarefas');
console.log('   👥 Usuários:    http://localhost:3000/usuarios');
console.log('   🏷️  Categorias:  http://localhost:3000/categorias');
console.log('');
console.log('🎉 Pronto para usar! Boa sorte no projeto!');

// Opcionalmente, iniciar o servidor automaticamente
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('🚀 Deseja iniciar o servidor agora? (s/N): ', (answer) => {
    if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'y') {
        console.log('🚀 Iniciando servidor...');
        console.log('');
        try {
            execSync('npm start', { stdio: 'inherit' });
        } catch (error) {
            console.log('');
            console.log('ℹ️  Servidor finalizado.');
        }
    } else {
        console.log('');
        console.log('💡 Para iniciar o servidor manualmente:');
        console.log('   npm start');
        console.log('');
        console.log('✨ Até logo!');
    }
    readline.close();
});