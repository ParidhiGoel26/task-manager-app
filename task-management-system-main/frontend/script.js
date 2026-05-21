// API Configuration
const API_URL = 'http://localhost:5000/api/v1';
let currentUser = null;
let authToken = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initializing...');
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
        authToken = token;
        currentUser = JSON.parse(savedUser);
        showDashboard();
        loadTasks();
    }
    
    // Setup form submit handlers
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('registerFormElement');
    const taskForm = document.getElementById('taskForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (taskForm) taskForm.addEventListener('submit', handleSaveTask);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    
    console.log('Event listeners attached');
});

// Switch between login/register tabs
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.tab-btn');
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        tabs[1].classList.add('active');
        tabs[0].classList.remove('active');
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('Please fill all fields', 'error');
        return;
    }
    
    try {
        showToast('Logging in...', 'success');
        
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            authToken = data.data.token;
            currentUser = data.data;
            
            // Save to localStorage
            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            showToast('Login successful!', 'success');
            showDashboard();
            loadTasks();
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Network error. Make sure backend is running on port 5000', 'error');
    }
}

// Handle Register
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    
    if (!name || !email || !password) {
        showToast('Please fill all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    try {
        showToast('Creating account...', 'success');
        
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });
        
        const data = await response.json();
        
        if (data.success) {
            authToken = data.data.token;
            currentUser = data.data;
            
            // Save to localStorage
            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            showToast('Registration successful!', 'success');
            showDashboard();
            loadTasks();
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showToast('Network error. Make sure backend is running', 'error');
    }
}

// Show Dashboard (hide auth, show tasks)
function showDashboard() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    
    // Update navigation
    const userNameSpan = document.getElementById('userName');
    const roleBadge = document.getElementById('userRole');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userNameSpan) userNameSpan.textContent = currentUser.name;
    if (roleBadge) {
        roleBadge.textContent = currentUser.role.toUpperCase();
        roleBadge.className = `user-role-badge ${currentUser.role}`;
    }
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
}

// Show Auth (hide dashboard)
function showAuth() {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.style.display = 'none';
    
    // Clear forms
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('regName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
}

// Handle Logout
function handleLogout() {
    console.log('Logout clicked');
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear global variables
    authToken = null;
    currentUser = null;
    
    // Show auth screen
    showAuth();
    
    // Show success message
    showToast('Logged out successfully', 'success');
    
    console.log('User logged out');
}

// Load Tasks
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayTasks(data.data);
        } else {
            showToast(data.message || 'Failed to load tasks', 'error');
        }
    } catch (error) {
        console.error('Load tasks error:', error);
        showToast('Failed to load tasks', 'error');
    }
}

// Display Tasks
function displayTasks(tasks) {
    const tasksList = document.getElementById('tasksList');
    
    if (!tasks || tasks.length === 0) {
        tasksList.innerHTML = '<div class="loading">No tasks yet. Create your first task!</div>';
        return;
    }
    
    tasksList.innerHTML = tasks.map(task => `
        <div class="task-card">
            <div class="task-header">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-priority priority-${task.priority}">
                    ${task.priority.toUpperCase()}
                </div>
            </div>
            <div class="task-description">
                ${escapeHtml(task.description || 'No description')}
            </div>
            <div class="task-meta">
                <span class="task-status status-${task.status}">
                    ${task.status.replace('-', ' ').toUpperCase()}
                </span>
                <span>📅 ${task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Recent'}</span>
            </div>
            <div class="task-actions">
                <button class="btn-edit" onclick="editTask('${task.id}')">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteTask('${task.id}')">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

// Show Create Task Modal
function showCreateTaskModal() {
    document.getElementById('modalTitle').textContent = 'Create New Task';
    document.getElementById('taskId').value = '';
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskStatus').value = 'pending';
    document.getElementById('taskPriority').value = 'medium';
    document.getElementById('taskDueDate').value = '';
    document.getElementById('taskModal').style.display = 'block';
}

// Edit Task
async function editTask(taskId) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const task = data.data;
            document.getElementById('modalTitle').textContent = 'Edit Task';
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description || '';
            document.getElementById('taskStatus').value = task.status;
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskDueDate').value = task.dueDate || '';
            document.getElementById('taskModal').style.display = 'block';
        }
    } catch (error) {
        showToast('Failed to load task', 'error');
    }
}

// Handle Save Task (Create/Update)
async function handleSaveTask(event) {
    event.preventDefault();
    
    const taskId = document.getElementById('taskId').value;
    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        status: document.getElementById('taskStatus').value,
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDueDate').value || null
    };
    
    if (!taskData.title) {
        showToast('Title is required', 'error');
        return;
    }
    
    try {
        let response;
        
        if (taskId) {
            // Update existing task
            response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(taskData)
            });
        } else {
            // Create new task
            response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(taskData)
            });
        }
        
        const data = await response.json();
        
        if (data.success) {
            showToast(taskId ? 'Task updated!' : 'Task created!', 'success');
            closeTaskModal();
            loadTasks();
        } else {
            showToast(data.message || 'Operation failed', 'error');
        }
    } catch (error) {
        console.error('Save task error:', error);
        showToast('Failed to save task', 'error');
    }
}

// Delete Task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Task deleted!', 'success');
            loadTasks();
        } else {
            showToast(data.message || 'Delete failed', 'error');
        }
    } catch (error) {
        showToast('Failed to delete task', 'error');
    }
}

// Close Modal
function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

// Show Toast Message
function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('taskModal');
    if (event.target === modal) {
        closeTaskModal();
    }
}