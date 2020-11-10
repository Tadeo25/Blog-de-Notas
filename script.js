const formNotes = document.getElementById('formNotes')
const tittleInput = document.getElementById('tittle')
const textAreaInput = document.getElementById('textArea')
const categoryInput = document.getElementById('category')
const tittleModalInput = document.getElementById('tittleModal')
const textAreaModalInput = document.getElementById('textAreaModal')
const formEditNotes = document.getElementById('formEditNotes')
let editNoteId = '';


const generateId = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};


formNotes.onsubmit = (e) => {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  e.preventDefault();
  const tittle = tittleInput.value;
  const textArea = textAreaInput.value;
  const category = categoryInput.value;

  notes.push({
    tittle,
    textArea,
    category,
    id: generateId(),
    createdAt: Date.now(),
  })

  const notesJson = JSON.stringify(notes);
  localStorage.setItem('notes', notesJson);

  console.log("formNotes.onsubmit => notes", notes)
  formNotes.reset();
  displayNotes();
}

const getModal = (note => {
  const createdAt = new Date(note.createdAt);
  return `
  <div class="modal fade" id="modal${note.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title" id="exampleModalLabel">${note.tittle}</h3>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body bg-dark">
        <h5>${note.category}</h5>
        <textarea class="form-control" id="textArea" rows="3" maxlength="500">${note.textArea}</textarea>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>
        </div>



  `
})


const loadForm = (noteId) => {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const note = notes.find((n) => n.id === noteId)
  tittleModalInput.value = note.tittle;
  textAreaModalInput.value = note.textArea;
  editNoteId = noteId;
}

function displayNotes() {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const rows = [];
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const createdAt = new Date(note.createdAt);
    const div = `
    <div class="ml-5 card-note" style="width: 200px;">

    <div class="h-100 card text-white bg-dark mb-3" style="max-width: 18rem;">
        <div class="card-header">${note.category}</div>
        <div class="card-body">
            <h5 class="card-title">${note.tittle}</h5>
            <button type="button" class="btn btn-outline-success" data-toggle="modal" data-target="#modal${note.id}">
            <i class="fas fa-glasses"></i>
            </button>
            <button type="button" class="btn btn-outline-primary" data-toggle="modal" data-target="#staticBackdrop1"
            onclick="loadForm('${note.id}')">
            <i class="fas fa-marker"></i>
            </button>
            <button onclick="deleteNotes('${note.id}')" class="btn btn-outline-danger">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    </div>
</div>
${getModal(note)}



        `
    rows.push(div)
  }
  notesTable.innerHTML = rows.join('')
}
displayNotes();

function deleteNotes(noteId) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const filteredNotes = notes.filter((note) => note.id !== noteId);
  console.log(filteredNotes);
  const notesJson = JSON.stringify(filteredNotes);
  localStorage.setItem('notes', notesJson);
  displayNotes();
}


formEditNotes.onsubmit = (e) => {
  e.preventDefault();
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const tittle = tittleModalInput.value;
  const textArea = textAreaModalInput.value;

  const updateNotes = notes.map((n) => {
    if (n.id === editNoteId) {
      const note = {
        ...n,
        tittle,
        textArea,
      }
      return note
    } else {
      return n;
    }
  })
  const notesJson = JSON.stringify(updateNotes);
  localStorage.setItem('notes', notesJson);
  formEditNotes.reset();
  displayNotes();
  $('#staticBackdrop1').modal('hide');
}