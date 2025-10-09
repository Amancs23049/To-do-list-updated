let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const filterBtns = document.querySelectorAll('.filter-btn');

// Add event listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Add a new task
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    taskInput.value = '';
    renderTasks();
}

// Delete a task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

// Start editing a task
function startEdit(id) {
    editingTaskId = id;
    renderTasks();
}

// Save edited task
function saveEdit(id) {
    const input = document.getElementById(`edit-input-${id}`);
    const newText = input.value.trim();
    
    if (newText === '') {
        alert('Task cannot be empty!');
        return;
    }
    
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.text = newText;
        editingTaskId = null;
        renderTasks();
    }
}

// Cancel editing
function cancelEdit() {
    editingTaskId = null;
    renderTasks();
}

// Clear completed tasks
function clearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
        alert('No completed tasks to clear!');
        return;
    }
    
    if (confirm(`Delete ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`)) {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
    }
}

// Delete all tasks
function deleteAll() {
    if (tasks.length === 0) {
        alert('No tasks to delete!');
        return;
    }
    
    if (confirm('Are you sure you want to delete ALL tasks?')) {
        tasks = [];
        renderTasks();
    }
}

// Render tasks to the DOM
function renderTasks() {
    let filteredTasks = tasks;

    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">No tasks to show ✨</div>';
    } else {
        taskList.innerHTML = filteredTasks.map(task => {
            const isEditing = editingTaskId === task.id;
            
            return `
                <li class="task-item ${task.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}">
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        ${task.completed ? 'checked' : ''}
                        onchange="toggleTask(${task.id})"
                        ${isEditing ? 'disabled' : ''}
                    />
                    ${
                        isEditing 
                        ? `<input 
                            type="text" 
                            class="task-edit-input" 
                            id="edit-input-${task.id}"
                            value="${task.text}"
                            onkeypress="if(event.key === 'Enter') saveEdit(${task.id})"
                            autofocus
                        />`
                        : `<span class="task-text">${task.text}</span>`
                    }
                    <div class="task-actions">
                        ${
                            isEditing 
                            ? `<button class="save-btn" onclick="saveEdit(${task.id})">Save</button>
                               <button class="cancel-btn" onclick="cancelEdit()">Cancel</button>`
                            : `<button class="edit-btn" onclick="startEdit(${task.id})" ${task.completed ? 'disabled' : ''}>Edit</button>
                               <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>`
                        }
                    </div>
                </li>
            `;
        }).join('');
    }

    const activeCount = tasks.filter(t => !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;
    taskCount.textContent = `${activeCount} active, ${completedCount} completed`;
}

// Initialize
renderTasks();
