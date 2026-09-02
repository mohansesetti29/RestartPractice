const API_URL = "http://127.0.0.1:5000";

async function checkServer() {
    const status = document.getElementById("serverStatus");

    try {
        const response = await fetch(`${API_URL}/api/health`);
        const data = await response.json();

        if (data.status === "ok") {
            status.textContent = "Backend connected";
        }
    } catch (error) {
        status.textContent = "Backend offline";
    }
}

async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/api/tasks`);
        const tasks = await response.json();

        const taskList = document.getElementById("taskList");

        if (tasks.length === 0) {
            taskList.innerHTML =
                '<p class="empty">No tasks yet.</p>';
            return;
        }

        taskList.innerHTML = tasks.map(task => `
            <div class="task">
                <span>${escapeHtml(task.title)}</span>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    Delete
                </button>
            </div>
        `).join("");

    } catch (error) {
        console.error(error);
    }
}

async function addTask() {

    const input = document.getElementById("taskInput");
    const title = input.value.trim();

    if (!title) {
        alert("Enter a task first.");
        return;
    }

    try {

        await fetch(`${API_URL}/api/tasks`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: title
            })
        });

        input.value = "";

        await loadTasks();

    } catch (error) {
        console.error(error);
        alert("Could not connect to backend.");
    }
}

async function deleteTask(id) {

    try {

        await fetch(`${API_URL}/api/tasks/${id}`, {
            method: "DELETE"
        });

        await loadTasks();

    } catch (error) {
        console.error(error);
    }
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

checkServer();
loadTasks();