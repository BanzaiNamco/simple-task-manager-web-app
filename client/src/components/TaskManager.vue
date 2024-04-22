<template>
    <div class="task-manager">
        <h1>Task Manager</h1>
        <button @click="showForm = !showForm">
            {{ showForm ? 'Hide' : 'Add Task' }} Form
        </button>
        <form v-if="showForm" @submit.prevent="addTask(newTask.title, newTask.status)">
            <input
                type="text"
                v-model="newTask.title"
                placeholder="Task Title"
            />
            <select v-model="newTask.status">
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>
            <button type="submit">Add Task</button>
        </form>
        <table>
            <thead>
                <tr>
                    <th>Task</th>
                    <th>Status</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="task in tasks" :key="task.id">
                    <td>{{ task.title }}</td>
                    <td>{{ task.status }}</td>
                    <td class = "buttonContainer updateButton">
                        <button
                            v-if="task.status === 'In Progress'"
                            @click="updateTaskStatus(task.id, 'Completed')"
                        >
                            Mark as Completed
                        </button>
                        <button
                            v-else
                            @click="updateTaskStatus(task.id, 'In Progress')"
                        >
                            Mark as In Progress
                        </button>
                    </td>
                    <td class = "buttonContainer deleteButton">
                        <button
                            @click="deleteTask(task.id)"
                        >
                            Delete Task
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'TaskManager',
    data() {
        return {
            tasks: [],
            showForm: false,
            newTask: {
                title: '',
                status: 'In Progress'
            }
        }
    },
    async created() {
        const response = await fetch(
            'http://localhost:3000/tasks',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        if (!response.ok) {
            alert('Failed to connect to the server!');
        }
        this.tasks = await response.json();
    },
    methods: {
        async addTask(title, status) {
            const response = await fetch(
                'http://localhost:3000/tasks',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: title,
                        status: status
                    })
                }
            );
            if (response.ok) {
                const res = await response.json();
                const newTask = {
                    id: res.id,
                    title: title,
                    status: status
                };
                this.tasks.push(newTask);
                this.newTask.title = '';
                this.newTask.status = 'In Progress';
            } else {
                alert('Failed to add task!');
            }
        },
        async updateTaskStatus(id, status) {
            const response = await fetch(
                `http://localhost:3000/tasks/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status })
                }
            );
            if (response.ok) {
                const taskIndex = this.tasks.findIndex(task => task.id === id);
                this.tasks[taskIndex].status = status;
            } else {
                alert('Failed to update task status!');
            }
        },
        async deleteTask(id) {
            const response = await fetch(
                `http://localhost:3000/tasks/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.ok) {
                this.tasks = this.tasks.filter(task => task.id !== id);
            } else {
                alert('Failed to delete task!');
            }
        }
    },
}
</script>

<style scoped>
.task-manager {
    margin: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

button, select, input{
    border-radius: 10px;
    padding: 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
    border: none;
}

button, select {
    color: white;
    background-color: #007bff;
    transition: background-color 0.3s;
}

button:hover, select:hover {
    background-color: #0056b3;
}

table {
    width: auto;
    margin-top: 2rem;
    border-collapse: collapse;
}

th, td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
    white-space: nowrap;
}

.updateButton button {
    background-color: #4CAF50;
    color: white;
}

.updateButton button:hover {
    background-color: #45a049;
}

.deleteButton button {
    background-color: #f44336;
    color: white;
}

.deleteButton button:hover {
    background-color: #da190b;
}

form {
    margin-top: 1rem;
    width: 22%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
}
</style>