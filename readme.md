Documentação do Gerenciador de Tarefas

Descrição do Sistema

O Gerenciador de Tarefas é uma aplicação web desenvolvida em Node.js com Express, utilizando o padrão MVC (Model-View-Controller) e banco de dados PostgreSQL. O sistema permite gerenciar tarefas, atribuindo-as a usuários e categorizando-as. Cada tarefa pode ter um título, uma descrição, uma duração estimada (em minutos) e ser associada a múltiplos usuários e categorias.

Funcionalidades

Usuários: Criar, listar, atualizar e excluir usuários, além de listar suas tarefas associadas.

Tarefas: Criar, listar, atualizar e excluir tarefas, com suporte a duração, e listar suas categorias associadas.

Categorias: Criar, listar, atualizar e excluir categorias.

Associações: Gerenciar relações entre usuários e tarefas, e entre tarefas e categorias.

Frontend: Interface web renderizada com EJS para visualização de usuários e tarefas.

Modelo Físico do Banco de Dados

O banco de dados é composto por cinco tabelas:

Tabela Users

id: Chave primária (SERIAL).

nome: Nome do usuário (VARCHAR, obrigatório).

created_at: Data de criação (TIMESTAMP, padrão CURRENT_TIMESTAMP).

update_at: Data de atualização (TIMESTAMP, padrão CURRENT_TIMESTAMP).

Tabela Tasks

id: Chave primária (SERIAL).

titulo: Título da tarefa (VARCHAR, obrigatório).

descricao: Descrição da tarefa (TEXT, opcional).

duracao: Duração estimada da tarefa em minutos (INT, opcional).

created_at: Data de criação (TIMESTAMP, padrão CURRENT_TIMESTAMP).

update_at: Data de atualização (TIMESTAMP, padrão CURRENT_TIMESTAMP).

Tabela Categories

id: Chave primária (SERIAL).

titulo: Título da categoria (VARCHAR, obrigatório).

Tabela user_task

id: Chave primária (SERIAL).

id_user: Chave estrangeira referenciando Users(id) (INT, obrigatório).

id_task: Chave estrangeira referenciando Tasks(id) (INT, obrigatório).

Chaves estrangeiras com ON DELETE CASCADE.

Tabela task_category

id_task: Chave primária composta, referenciando Tasks(id) (INT, obrigatório).

id_category: Chave primária composta, referenciando Categories(id) (INT, obrigatório).

Chaves estrangeiras com ON DELETE CASCADE.

Configuração do Ambiente

Pré-requisitos

Node.js (v14 ou superior)

PostgreSQL (v12 ou superior)

Dependências listadas no package.json:

express: Framework web

pg: Cliente PostgreSQL para Node.js

dotenv: Gerenciamento de variáveis de ambiente

ejs: Template engine para views

body-parser: Parsing de formulários

nodemon: Desenvolvimento (hot-reload)

jest e supertest: Testes

Instalação

Clone o repositório:

git clone <URL_DO_REPOSITORIO>
cd mvc-boilerplate

Instale as dependências:

npm install

Configure as variáveis de ambiente em um arquivo .env:

DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
DB_PORT=5432
PORT=3000

Execute o script de inicialização do banco de dados:

npm run init-db

Inicie o servidor:

npm run dev

Estrutura do Projeto

O projeto segue o padrão MVC:

Models: Contêm a lógica de interação com o banco de dados (userModel.js, taskModel.js, categoryModel.js, userTaskModel.js, taskCategoryModel.js).

Services: Camada intermediária que executa consultas SQL diretamente (userService.js, taskService.js, categoryService.js, userTaskService.js, taskCategoryService.js).

Controllers: Gerenciam as requisições HTTP (userController.js, taskController.js, categoryController.js, userTaskController.js, taskCategoryController.js).

Rotas: Definem os endpoints da API (userRoutes.js, taskRoutes.js, categoryRoutes.js, userTaskRoutes.js, taskCategoryRoutes.js) e do frontend (frontRoutes.js).

Views: Arquivos EJS para renderizar o frontend (views/layout/main.ejs, views/pages/page1.ejs, views/pages/page2.ejs).

Public: Arquivos estáticos como CSS (public/styles.css).

Scripts: Script para inicialização do banco de dados (runSQLScript.js).

Config: Configuração do banco de dados (config/db.js).

Servidor: Arquivo principal (server.js) e módulo opcional (app.js).

Endpoints da API

Usuários (/users)

GET /users: Lista todos os usuários.

GET /users/:id: Busca um usuário por ID.

GET /users/:id/tasks: Lista todas as tarefas associadas a um usuário.

POST /users: Cria um novo usuário.

Corpo: { "nome": "string" }

POST /users/edit/:id: Atualiza um usuário.

Corpo: { "nome": "string" }

POST /users/delete/:id: Exclui um usuário.

Tarefas (/tasks)

GET /tasks: Lista todas as tarefas.

GET /tasks/:id: Busca uma tarefa por ID.

GET /tasks/:id/categories: Lista todas as categorias associadas a uma tarefa.

POST /tasks: Cria uma nova tarefa.

Corpo: { "titulo": "string", "descricao": "string", "duracao": number }

POST /tasks/edit/:id: Atualiza uma tarefa.

Corpo: { "titulo": "string", "descricao": "string", "duracao": number }

POST /tasks/delete/:id: Exclui uma tarefa.

Categorias (/categories)

GET /categories: Lista todas as categorias.

GET /categories/:id: Busca uma categoria por ID.

POST /categories: Cria uma nova categoria.

Corpo: { "titulo": "string" }

POST /categories/edit/:id: Atualiza uma categoria.

Corpo: { "titulo": "string" }

POST /categories/delete/:id: Exclui uma categoria.

Associações Usuário-Tarefa (/user-task)

POST /user-task: Cria uma associação entre usuário e tarefa.

Corpo: { "id_user": number, "id_task": number }

POST /user-task/delete/:id_user/:id_task: Exclui uma associação.

Associações Tarefa-Categoria (/task-category)

POST /task-category: Cria uma associação entre tarefa e categoria.

Corpo: { "id_task": number, "id_category": number }

POST /task-category/delete/:id_task/:id_category: Exclui uma associação.




