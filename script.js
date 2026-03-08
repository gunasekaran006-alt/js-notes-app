const input = document.getElementById("noteInput");
const notesList = document.getElementById("notesList");
const itemsLeft = document.getElementById("itemsLeft");
const clearBtn = document.getElementById("clearCompletedBtn");
const filterButtons = document.querySelectorAll(".filters button");
const themeIcon = document.getElementById("theme-icon"); // Theme Icon Selected

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let currentFilter = "all";

// Dark Mode Toggle Logic
themeIcon.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    // Change icon based on theme
    if(document.body.classList.contains("dark-theme")) {
        themeIcon.textContent = "☀️";
    } else {
        themeIcon.textContent = "🌙";
    }
});

// Add new Note
input.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && input.value.trim() !== "") {
        const newNote = {
            id: Date.now(),
            text: input.value,
            completed: false
        };
        notes.push(newNote);
        input.value = "";
        updateAndRender();
    }
});

// Toggle Completion Status
function toggleNote(id) {
    notes = notes.map(note =>
        note.id === id ? { ...note, completed: !note.completed } : note
    );
    updateAndRender();
}

// Delete Note
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    updateAndRender();
}

// Clear Completed Notes
clearBtn.addEventListener("click", function() {
    notes = notes.filter(note => !note.completed);
    updateAndRender();
});

// Filter Notes Logic
filterButtons.forEach(button => {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter; // Using data-filter attribute
        
        // Remove active class from all, add to clicked
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        
        renderNotes(); // Just render, no need to save
    });
});

// Save to LocalStorage and Render
function updateAndRender() {
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
}

// Render Notes to UI
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
        const span = document.createElement("span");
        
        span.textContent = note.text;
        
        if (note.completed) {
            span.classList.add("completed");
        }
        
        span.addEventListener("click", function() {
            toggleNote(note.id);
        });

        const delBtn = document.createElement("button");
        delBtn.textContent = "❌";
        delBtn.classList.add("delete-btn");
        delBtn.addEventListener("click", function(e) {
            e.stopPropagation(); // Prevents li click event when clicking delete
            deleteNote(note.id);
        });

        li.appendChild(span);
        li.appendChild(delBtn);
        notesList.appendChild(li);
    });

    const activeCount = notes.filter(n => !n.completed).length;
    itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
}

// Initial Render
renderNotes();