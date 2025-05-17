// main.js
import {
  collection, addDoc, onSnapshot,
  updateDoc, doc, deleteDoc, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const db         = window.firebase.db;
const moviesCol  = collection(db, 'movies');
const tableBody  = document.querySelector('#movieTable tbody');

// Selección de elementos del DOM (asume que tienen los mismos IDs que antes)
const searchById       = document.getElementById('searchById');
const searchByTitle    = document.getElementById('searchByTitle');
const addMovieForm     = document.getElementById('addMovieForm');
const editMovieForm    = document.getElementById('editMovieForm');
const editRowIndex     = document.getElementById('editRowIndex');
const movieTitle       = document.getElementById('movieTitle');
const movieDescription = document.getElementById('movieDescription');
const movieYear        = document.getElementById('movieYear');

// 1) Lectura en tiempo real
onSnapshot(moviesCol, snapshot => {
  tableBody.innerHTML = '';
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const tr   = document.createElement('tr');
    tr.dataset.id = docSnap.id;
    tr.innerHTML = `
      <td>${data.id}</td>
      <td> <span class="details-link">${data.title}</span></td>
      <td>${data.description}</td>
      <td>${data.year}</td>
      <td><img src="${data.coverUrl}" class="movie-img"></td>
      <td>${data.createdAt}</td>
      <td>${data.updatedAt}</td>
      <td>
        <button class="btn btn-sm btn-warning edit-btn">Editar</button>
        <button class="btn btn-sm btn-danger delete-btn">Eliminar</button>
      </td>`;
    tableBody.appendChild(tr);
  });
  applyFilters();
});

// 2) Crear película
addMovieForm.addEventListener('submit', async e => {
  e.preventDefault();
  const newMovie = {
    id:         Date.now(),  // puedes usar otro esquema de ID
    title:      movieTitle.value,
    description: movieDescription.value,
    year:       Number(movieYear.value),
    coverUrl:   'https://w7.pngwing.com/pngs/128/992/png-transparent-cinema-icons-marker-matt-movie-scene-slate-symbol-gray-movie.png',
    createdAt:  new Date().toISOString(),
    updatedAt:  new Date().toISOString()
  };
  await addDoc(moviesCol, newMovie);
  bootstrap.Modal.getInstance(document.getElementById('addMovieModal')).hide();
  addMovieForm.reset();
});

// 3) Delegación: eliminar y preparar edición
tableBody.addEventListener('click', async e => {
  const tr    = e.target.closest('tr');
  const docId = tr.dataset.id;
  if (e.target.classList.contains('delete-btn')) {
    await deleteDoc(doc(db, 'movies', docId));
  }
  if (e.target.classList.contains('edit-btn')) {
    const docRef = doc(db, 'movies', docId);
    const snap   = await getDocs(query(moviesCol, where('__name__','==',docId)));
    const data   = snap.docs[0].data();
    editRowIndex.value     = docId;
    document.getElementById('editTitle').value       = data.title;
    document.getElementById('editDescription').value = data.description;
    document.getElementById('editYear').value        = data.year;
    new bootstrap.Modal(document.getElementById('editMovieModal')).show();
  }
});

// 4) Guardar edición
editMovieForm.addEventListener('submit', async e => {
  e.preventDefault();
  const docId = editRowIndex.value;
  const ref   = doc(db, 'movies', docId);
  await updateDoc(ref, {
    title:      document.getElementById('editTitle').value,
    description: document.getElementById('editDescription').value,
    year:       Number(document.getElementById('editYear').value),
    updatedAt:  new Date().toISOString()
  });
  bootstrap.Modal.getInstance(document.getElementById('editMovieModal')).hide();
});

// 5) Filtrado en la tabla
const applyFilters = () => {
  const idVal    = searchById.value.trim();
  const titleVal = searchByTitle.value.trim().toLowerCase();
  tableBody.querySelectorAll('tr').forEach(row => {
    const cells = row.children;
    const matches =
      (!idVal   || cells[0].textContent === idVal) &&
      (!titleVal || cells[1].textContent.toLowerCase().includes(titleVal));
    row.style.display = matches ? '' : 'none';
  });
};
searchById.addEventListener('input',    applyFilters);
searchByTitle.addEventListener('input', applyFilters);

