// ========================================
// TASKFLOW - JavaScript Principal
// Sistema de Gerenciamento de Tarefas
// ========================================

// Estado global da aplicação
let appData = {
    tasks: [],
    users: [],
    categories: [],
    currentTask: null,
    currentUser: null,
    currentCategory: null
};

// ========================================
// UTILITÁRIOS GERAIS
// ========================================

// Mostrar notificação na tela
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    
    notification.className = `notification ${type} show`;
    messageElement.textContent = message;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Formatar data para português
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Formatar duração em minutos para formato legível
function formatTime(minutes) {
    if (!minutes || minutes === 0) return 'Sem tempo definido';
    
    if (minutes < 60) {
        return `${minutes} minutos`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
        return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}min`;
}

// Debounce para pesquisas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// API - COMUNICAÇÃO COM O SERVIDOR
// ========================================

class API {
    static async request(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            showNotification('Erro ao comunicar com o servidor', 'error');
            throw error;
        }
    }

    // Tarefas
    static async getTasks() {
        return this.request('/tasks');
    }

    static async createTask(task) {
        return this.request('/tasks', {
            method: 'POST',
            body: JSON.stringify(task)
        });
    }

    static async updateTask(id, task) {
        return this.request(`/tasks/edit/${id}`, {
            method: 'POST',
            body: JSON.stringify(task)
        });
    }

    static async deleteTask(id) {
        return this.request(`/tasks/delete/${id}`, {
            method: 'POST'
        });
    }

    // Usuários
    static async getUsers() {
        return this.request('/users');
    }

    static async createUser(user) {
        return this.request('/users', {
            method: 'POST',
            body: JSON.stringify(user)
        });
    }

    static async updateUser(id, user) {
        return this.request(`/users/edit/${id}`, {
            method: 'POST',
            body: JSON.stringify(user)
        });
    }

    static async deleteUser(id) {
        return this.request(`/users/delete/${id}`, {
            method: 'POST'
        });
    }

    static async getUserTasks(id) {
        return this.request(`/users/${id}/tasks`);
    }

    // Categorias
    static async getCategories() {
        return this.request('/categories');
    }

    static async createCategory(category) {
        return this.request('/categories', {
            method: 'POST',
            body: JSON.stringify(category)
        });
    }

    static async updateCategory(id, category) {
        return this.request(`/categories/edit/${id}`, {
            method: 'POST',
            body: JSON.stringify(category)
        });
    }

    static async deleteCategory(id) {
        return this.request(`/categories/delete/${id}`, {
            method: 'POST'
        });
    }
}

// ========================================
// DASHBOARD - PÁGINA INICIAL
// ========================================

async function initDashboard() {
    try {
        // Carregar dados
        await loadAllData();
        
        // Atualizar estatísticas
        updateStats();
        
        // Carregar tarefas recentes
        loadRecentTasks();
        
    } catch (error) {
        console.error('Erro ao inicializar dashboard:', error);
        showNotification('Erro ao carregar dados do dashboard', 'error');
    }
}

async function loadAllData() {
    try {
        const [tasks, users, categories] = await Promise.all([
            API.getTasks(),
            API.getUsers(),
            API.getCategories()
        ]);
        
        appData.tasks = tasks;
        appData.users = users;
        appData.categories = categories;
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        throw error;
    }
}

function updateStats() {
    // Atualizar contadores
    document.getElementById('total-tasks').textContent = appData.tasks.length;
    document.getElementById('total-users').textContent = appData.users.length;
    document.getElementById('total-categories').textContent = appData.categories.length;
    
    // Calcular tempo total
    const totalMinutes = appData.tasks.reduce((sum, task) => sum + (task.duracao || 0), 0);
    const totalHours = Math.round(totalMinutes / 60);
    document.getElementById('total-time').textContent = totalHours > 0 ? `${totalHours}h` : '0h';
}

function loadRecentTasks() {
    const container = document.getElementById('recent-tasks');
    if (!container) return;
    
    const recentTasks = appData.tasks.slice(-3).reverse();
    
    if (recentTasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-tasks"></i>
                </div>
                <h3 class="empty-title">Nenhuma tarefa ainda</h3>
                <p class="empty-description">Crie sua primeira tarefa para começar!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentTasks.map(task => `
        <div class="item-card" style="margin-bottom: 1rem;">
            <div class="item-header">
                <h4 class="item-title">${task.titulo}</h4>
                <span class="meta-tag">
                    <i class="fas fa-clock"></i>
                    ${formatTime(task.duracao)}
                </span>
            </div>
            <p class="item-description">${task.descricao || 'Sem descrição'}</p>
        </div>
    `).join('');
}

// ========================================
// TAREFAS - GERENCIAMENTO
// ========================================

async function initTasks() {
    try {
        await loadTasks();
        setupTaskSearch();
        setupTaskForm();
    } catch (error) {
        console.error('Erro ao inicializar tarefas:', error);
        showNotification('Erro ao carregar tarefas', 'error');
    }
}

async function loadTasks() {
    const loading = document.getElementById('tasksLoading');
    const grid = document.getElementById('tasksGrid');
    const empty = document.getElementById('tasksEmpty');
    
    // Mostrar loading
    loading.classList.remove('hidden');
    grid.classList.add('hidden');
    empty.classList.add('hidden');
    
    try {
        appData.tasks = await API.getTasks();
        renderTasks();
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        showNotification('Erro ao carregar tarefas', 'error');
    } finally {
        loading.classList.add('hidden');
    }
}

function renderTasks(tasksToRender = null) {
    const grid = document.getElementById('tasksGrid');
    const empty = document.getElementById('tasksEmpty');
    const tasks = tasksToRender || appData.tasks;
    
    if (tasks.length === 0) {
        grid.classList.add('hidden');
        empty.classList.remove('hidden');
        return;
    }
    
    grid.classList.remove('hidden');
    empty.classList.add('hidden');
    
    grid.innerHTML = tasks.map(task => `
        <div class="item-card">
            <div class="item-header">
                <h3 class="item-title">${task.titulo}</h3>
                <div class="item-actions">
                    <button class="btn btn-small btn-warning" onclick="editTask(${task.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-danger" onclick="deleteTask(${task.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            ${task.descricao ? `<p class="item-description">${task.descricao}</p>` : ''}
            
            <div class="item-meta">
                <span class="meta-tag">
                    <i class="fas fa-clock"></i>
                    ${formatTime(task.duracao)}
                </span>
                <span class="meta-tag">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(task.created_at)}
                </span>
            </div>
        </div>
    `).join('');
}

function setupTaskSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTasks = appData.tasks.filter(task => 
            task.titulo.toLowerCase().includes(searchTerm) ||
            (task.descricao && task.descricao.toLowerCase().includes(searchTerm))
        );
        renderTasks(filteredTasks);
    }, 300));
}

function setupTaskForm() {
    const form = document.getElementById('taskForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveTask();
    });
}

// Modal de tarefa
function openTaskModal(taskId = null) {
    const modal = document.getElementById('taskModal');
    const title = document.getElementById('taskModalTitle');
    const form = document.getElementById('taskForm');
    
    if (taskId) {
        // Modo edição
        const task = appData.tasks.find(t => t.id === taskId);
        if (task) {
            title.innerHTML = '<i class="fas fa-edit"></i> Editar Tarefa';
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskTitle').value = task.titulo;
            document.getElementById('taskDescription').value = task.descricao || '';
            document.getElementById('taskDuration').value = task.duracao || '';
            appData.currentTask = task;
        }
    } else {
        // Modo criação
        title.innerHTML = '<i class="fas fa-plus-circle"></i> Criar Nova Tarefa';
        form.reset();
        document.getElementById('taskId').value = '';
        appData.currentTask = null;
    }
    
    modal.classList.add('show');
}

function closeTaskModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.remove('show');
    appData.currentTask = null;
}

async function saveTask() {
    try {
        const taskData = {
            titulo: document.getElementById('taskTitle').value.trim(),
            descricao: document.getElementById('taskDescription').value.trim(),
            duracao: parseInt(document.getElementById('taskDuration').value) || null
        };
        
        if (!taskData.titulo) {
            showNotification('Por favor, digite um título para a tarefa', 'warning');
            return;
        }
        
        const taskId = document.getElementById('taskId').value;
        
        if (taskId) {
            // Editar tarefa existente
            await API.updateTask(taskId, taskData);
            showNotification('Tarefa atualizada com sucesso!', 'success');
        } else {
            // Criar nova tarefa
            await API.createTask(taskData);
            showNotification('Tarefa criada com sucesso!', 'success');
        }
        
        closeTaskModal();
        await loadTasks();
        
    } catch (error) {
        console.error('Erro ao salvar tarefa:', error);
        showNotification('Erro ao salvar tarefa', 'error');
    }
}

function editTask(taskId) {
    openTaskModal(taskId);
}

function deleteTask(taskId) {
    appData.currentTask = appData.tasks.find(t => t.id === taskId);
    document.getElementById('deleteModal').classList.add('show');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    appData.currentTask = null;
}

async function confirmDelete() {
    if (!appData.currentTask) return;
    
    try {
        await API.deleteTask(appData.currentTask.id);
        showNotification('Tarefa excluída com sucesso!', 'success');
        closeDeleteModal();
        await loadTasks();
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        showNotification('Erro ao excluir tarefa', 'error');
    }
}

// ========================================
// USUÁRIOS - GERENCIAMENTO
// ========================================

async function initUsers() {
    try {
        await loadUsers();
        setupUserSearch();
        setupUserForm();
    } catch (error) {
        console.error('Erro ao inicializar usuários:', error);
        showNotification('Erro ao carregar usuários', 'error');
    }
}

async function loadUsers() {
    const loading = document.getElementById('usersLoading');
    const grid = document.getElementById('usersGrid');
    const empty = document.getElementById('usersEmpty');
    
    loading.classList.remove('hidden');
    grid.classList.add('hidden');
    empty.classList.add('hidden');
    
    try {
        appData.users = await API.getUsers();
        renderUsers();
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        showNotification('Erro ao carregar usuários', 'error');
    } finally {
        loading.classList.add('hidden');
    }
}

function renderUsers(usersToRender = null) {
    const grid = document.getElementById('usersGrid');
    const empty = document.getElementById('usersEmpty');
    const users = usersToRender || appData.users;
    
    if (users.length === 0) {
        grid.classList.add('hidden');
        empty.classList.remove('hidden');
        return;
    }
    
    grid.classList.remove('hidden');
    empty.classList.add('hidden');
    
    grid.innerHTML = users.map(user => `
        <div class="item-card">
            <div class="item-header">
                <h3 class="item-title">
                    <i class="fas fa-user" style="color: #667eea;"></i>
                    ${user.nome}
                </h3>
                <div class="item-actions">
                    <button class="btn btn-small btn-info" onclick="viewUser(${user.id})" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-small btn-warning" onclick="editUser(${user.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-danger" onclick="deleteUser(${user.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="item-meta">
                <span class="meta-tag">
                    <i class="fas fa-id-card"></i>
                    ID: ${user.id}
                </span>
                <span class="meta-tag">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(user.created_at)}
                </span>
            </div>
        </div>
    `).join('');
}

function setupUserSearch() {
    const searchInput = document.getElementById('userSearchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredUsers = appData.users.filter(user => 
            user.nome.toLowerCase().includes(searchTerm)
        );
        renderUsers(filteredUsers);
    }, 300));
}

function setupUserForm() {
    const form = document.getElementById('userForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveUser();
    });
}

function openUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    const title = document.getElementById('userModalTitle');
    const form = document.getElementById('userForm');
    
    if (userId) {
        const user = appData.users.find(u => u.id === userId);
        if (user) {
            title.innerHTML = '<i class="fas fa-user-edit"></i> Editar Pessoa';
            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.nome;
            appData.currentUser = user;
        }
    } else {
        title.innerHTML = '<i class="fas fa-user-plus"></i> Adicionar Nova Pessoa';
        form.reset();
        document.getElementById('userId').value = '';
        appData.currentUser = null;
    }
    
    modal.classList.add('show');
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('show');
    appData.currentUser = null;
}

async function saveUser() {
    try {
        const userData = {
            nome: document.getElementById('userName').value.trim()
        };
        
        if (!userData.nome) {
            showNotification('Por favor, digite um nome', 'warning');
            return;
        }
        
        const userId = document.getElementById('userId').value;
        
        if (userId) {
            await API.updateUser(userId, userData);
            showNotification('Pessoa atualizada com sucesso!', 'success');
        } else {
            await API.createUser(userData);
            showNotification('Pessoa adicionada com sucesso!', 'success');
        }
        
        closeUserModal();
        await loadUsers();
        
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        showNotification('Erro ao salvar pessoa', 'error');
    }
}

function editUser(userId) {
    openUserModal(userId);
}

async function viewUser(userId) {
    const user = appData.users.find(u => u.id === userId);
    if (!user) return;
    
    try {
        const userTasks = await API.getUserTasks(userId);
        
        document.getElementById('userDetailsName').textContent = user.nome;
        document.getElementById('userDetailsId').textContent = user.id;
        document.getElementById('userDetailsFullName').textContent = user.nome;
        document.getElementById('userDetailsCreated').textContent = formatDate(user.created_at);
        
        const tasksList = document.getElementById('userTasksList');
        if (userTasks.length === 0) {
            tasksList.innerHTML = '<p style="color: var(--text-light); text-align: center;">Nenhuma tarefa atribuída</p>';
        } else {
            tasksList.innerHTML = userTasks.map(task => `
                <div class="item-card" style="margin-bottom: 0.5rem;">
                    <h4 style="margin-bottom: 0.5rem;">${task.titulo}</h4>
                    <span class="meta-tag">${formatTime(task.duracao)}</span>
                </div>
            `).join('');
        }
        
        document.getElementById('userDetailsModal').classList.add('show');
        
    } catch (error) {
        console.error('Erro ao carregar detalhes do usuário:', error);
        showNotification('Erro ao carregar detalhes', 'error');
    }
}

function closeUserDetailsModal() {
    document.getElementById('userDetailsModal').classList.remove('show');
}

function deleteUser(userId) {
    appData.currentUser = appData.users.find(u => u.id === userId);
    document.getElementById('deleteUserModal').classList.add('show');
}

function closeDeleteUserModal() {
    document.getElementById('deleteUserModal').classList.remove('show');
    appData.currentUser = null;
}

async function confirmUserDelete() {
    if (!appData.currentUser) return;
    
    try {
        await API.deleteUser(appData.currentUser.id);
        showNotification('Pessoa excluída com sucesso!', 'success');
        closeDeleteUserModal();
        await loadUsers();
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        showNotification('Erro ao excluir pessoa', 'error');
    }
}

// ========================================
// CATEGORIAS - GERENCIAMENTO
// ========================================

async function initCategories() {
    try {
        await loadCategories();
        setupCategorySearch();
        setupCategoryForm();
    } catch (error) {
        console.error('Erro ao inicializar categorias:', error);
        showNotification('Erro ao carregar categorias', 'error');
    }
}

async function loadCategories() {
    const loading = document.getElementById('categoriesLoading');
    const grid = document.getElementById('categoriesGrid');
    const empty = document.getElementById('categoriesEmpty');
    
    loading.classList.remove('hidden');
    grid.classList.add('hidden');
    empty.classList.add('hidden');
    
    try {
        appData.categories = await API.getCategories();
        renderCategories();
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        showNotification('Erro ao carregar categorias', 'error');
    } finally {
        loading.classList.add('hidden');
    }
}

function renderCategories(categoriesToRender = null) {
    const grid = document.getElementById('categoriesGrid');
    const empty = document.getElementById('categoriesEmpty');
    const categories = categoriesToRender || appData.categories;
    
    if (categories.length === 0) {
        grid.classList.add('hidden');
        empty.classList.remove('hidden');
        return;
    }
    
    grid.classList.remove('hidden');
    empty.classList.add('hidden');
    
    grid.innerHTML = categories.map(category => `
        <div class="item-card">
            <div class="item-header">
                <h3 class="item-title">
                    <i class="fas fa-tag" style="color: #f093fb;"></i>
                    ${category.titulo}
                </h3>
                <div class="item-actions">
                    <button class="btn btn-small btn-warning" onclick="editCategory(${category.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-danger" onclick="deleteCategory(${category.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="item-meta">
                <span class="meta-tag">
                    <i class="fas fa-id-card"></i>
                    ID: ${category.id}
                </span>
            </div>
        </div>
    `).join('');
}

function setupCategorySearch() {
    const searchInput = document.getElementById('categorySearchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCategories = appData.categories.filter(category => 
            category.titulo.toLowerCase().includes(searchTerm)
        );
        renderCategories(filteredCategories);
    }, 300));
}

function setupCategoryForm() {
    const form = document.getElementById('categoryForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveCategory();
    });
}

function openCategoryModal(categoryId = null) {
    const modal = document.getElementById('categoryModal');
    const title = document.getElementById('categoryModalTitle');
    const form = document.getElementById('categoryForm');
    
    if (categoryId) {
        const category = appData.categories.find(c => c.id === categoryId);
        if (category) {
            title.innerHTML = '<i class="fas fa-tag"></i> Editar Categoria';
            document.getElementById('categoryId').value = category.id;
            document.getElementById('categoryTitle').value = category.titulo;
            appData.currentCategory = category;
        }
    } else {
        title.innerHTML = '<i class="fas fa-tag"></i> Criar Nova Categoria';
        form.reset();
        document.getElementById('categoryId').value = '';
        appData.currentCategory = null;
    }
    
    modal.classList.add('show');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('show');
    appData.currentCategory = null;
}

async function saveCategory() {
    try {
        const categoryData = {
            titulo: document.getElementById('categoryTitle').value.trim()
        };
        
        if (!categoryData.titulo) {
            showNotification('Por favor, digite um nome para a categoria', 'warning');
            return;
        }
        
        const categoryId = document.getElementById('categoryId').value;
        
        if (categoryId) {
            await API.updateCategory(categoryId, categoryData);
            showNotification('Categoria atualizada com sucesso!', 'success');
        } else {
            await API.createCategory(categoryData);
            showNotification('Categoria criada com sucesso!', 'success');
        }
        
        closeCategoryModal();
        await loadCategories();
        
    } catch (error) {
        console.error('Erro ao salvar categoria:', error);
        showNotification('Erro ao salvar categoria', 'error');
    }
}

function editCategory(categoryId) {
    openCategoryModal(categoryId);
}

function deleteCategory(categoryId) {
    appData.currentCategory = appData.categories.find(c => c.id === categoryId);
    document.getElementById('deleteCategoryModal').classList.add('show');
}

function closeDeleteCategoryModal() {
    document.getElementById('deleteCategoryModal').classList.remove('show');
    appData.currentCategory = null;
}

async function confirmCategoryDelete() {
    if (!appData.currentCategory) return;
    
    try {
        await API.deleteCategory(appData.currentCategory.id);
        showNotification('Categoria excluída com sucesso!', 'success');
        closeDeleteCategoryModal();
        await loadCategories();
    } catch (error) {
        console.error('Erro ao excluir categoria:', error);
        showNotification('Erro ao excluir categoria', 'error');
    }
}

// Função para criar categorias sugeridas
async function createSuggestedCategory(name) {
    try {
        await API.createCategory({ titulo: name });
        showNotification(`Categoria "${name}" criada com sucesso!`, 'success');
        await loadCategories();
    } catch (error) {
        console.error('Erro ao criar categoria sugerida:', error);
        showNotification('Erro ao criar categoria', 'error');
    }
}

// ========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar qual página estamos
    const currentPage = window.location.pathname;
    
    // Fechar modais clicando fora
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
    
    // Fechar modais com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.classList.remove('show');
            });
        }
    });
    
    // Inicializar página específica
    if (currentPage === '/' || currentPage.includes('dashboard')) {
        initDashboard();
    } else if (currentPage.includes('tarefas')) {
        initTasks();
    } else if (currentPage.includes('usuarios')) {
        initUsers();
    } else if (currentPage.includes('categorias')) {
        initCategories();
    }
    
    console.log('🚀 TaskFlow inicializado com sucesso!');
});