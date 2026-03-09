const input = document.getElementById("noteInput");
const addBtn = document.getElementById("addBtn");
const notesList = document.getElementById("notesList");
const itemsLeft = document.getElementById("itemsLeft");
const clearBtn = document.getElementById("clearCompletedBtn");
const filterButtons = document.querySelectorAll(".filters button");
const themeIcon = document.getElementById("theme-icon");

let notes = JSON.parse(localStorage.getItem("my_tasks")) || [];
let currentFilter = "all";

// Theme Toggle
themeIcon.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
});

// Add Task function
function addTask() {
    if (input.value.trim() !== "") {
        const newNote = {
            id: Date.now(),
            text: input.value,
            completed: false
        };
        notes.push(newNote);
        input.value = "";
        updateAndRender();
    }
}

// Add via Enter key or Button
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
});
addBtn.addEventListener("click", addTask);

// Toggle Checkbox Status
function toggleNote(id) {
    notes = notes.map(note =>
        note.id === id ? { ...note, completed: !note.completed } : note
    );
    updateAndRender();
}

// Edit Task Text (U - Update)
function editNote(id, oldText) {
    const newText = prompt("Update your task:", oldText);
    
    // Check if user clicked Cancel or entered empty text
    if (newText !== null && newText.trim() !== "") {
        notes = notes.map(note =>
            note.id === id ? { ...note, text: newText.trim() } : note
        );
        updateAndRender();
    }
}

// Delete Task
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    updateAndRender();
}

// Clear Completed
clearBtn.addEventListener("click", () => {
    notes = notes.filter(note => !note.completed);
    updateAndRender();
});

// Filters
filterButtons.forEach(button => {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        renderNotes();
    });
});

// Save Data & Re-render
function updateAndRender() {
    localStorage.setItem("my_tasks", JSON.stringify(notes));
    renderNotes();
}

// Display Tasks on Screen
function renderNotes() {
    notesList.innerHTML = "";
    let filteredNotes = notes;

    if (currentFilter === "active") {
        filteredNotes = notes.filter(note => !note.completed);
    } else if (currentFilter === "completed") {
        filteredNotes = notes.filter(note => note.completed);
    }

    filteredNotes.forEach(note => {
        const li = document.createElement("li");
        
        // Task Content Wrapper (Checkbox + Text)
        const taskContent = document.createElement("div");
        taskContent.classList.add("task-content");
        if (note.completed) taskContent.classList.add("completed");
        
        const checkbox = document.createElement("span");
        checkbox.classList.add("checkbox");
        
        const textSpan = document.createElement("span");
        textSpan.classList.add("task-text");
        textSpan.textContent = note.text;

        taskContent.appendChild(checkbox);
        taskContent.appendChild(textSpan);

        taskContent.addEventListener("click", () => toggleNote(note.id));

        // Action Buttons Container (Edit + Delete)
        const actionBtns = document.createElement("div");
        actionBtns.classList.add("action-btns");

        // Edit Button ✏️
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Stop clicking the li background
            editNote(note.id, note.text);
        });

        // Delete Button 🗑️
        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.classList.add("delete-btn");
        delBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteNote(note.id);
        });

        actionBtns.appendChild(editBtn);
        actionBtns.appendChild(delBtn);

        li.appendChild(taskContent);
        li.appendChild(actionBtns);
        notesList.appendChild(li);
    });

    const activeCount = notes.filter(n => !n.completed).length;
    itemsLeft.textContent = `${activeCount} pending`;
}

renderNotes();