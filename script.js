const input = document.getElementById('noteInput');
const notesList = document.getElementById('notesList');
const itemsLeft = document.getElementById('itemsLeft');

let notes = [];

// (Create)
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && input.value.trim() !== "") {
        const newNote = {
            id: Date.now(),
            text: input.value,
            completed: false
        };
        notes.push(newNote);
        input.value = "";
        renderNotes();
    }
});

// (Update)
function toggleNote(id) {
    notes = notes.map(note => 
        note.id === id ? { ...note, completed: !note.completed } : note
    );
    renderNotes();
}

// (Delete)
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    renderNotes();
}

function clearCompleted() {
    notes = notes.filter(note => !note.completed);
    renderNotes();
}

// (Read)
function renderNotes() {
    notesList.innerHTML = "";
    notes.forEach(note => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${note.completed ? 'completed' : ''}" onclick="toggleNote(${note.id})">
                ${note.text}
            </span>
            <button onclick="deleteNote(${note.id})" style="border:none; background:none; cursor:pointer;">❌</button>
        `;
        notesList.appendChild(li);
    });
    
    const activeCount = notes.filter(n => !n.completed).length;
    itemsLeft.innerText = `${activeCount} items left`;
}