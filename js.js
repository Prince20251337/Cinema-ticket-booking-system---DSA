/* -------------------- Function to render all movie cards -------------------- */
function renderMovieCards() {
    const container = document.getElementById('movie-gallery-container');
    container.innerHTML = ''; // Clear existing content

    movieData.forEach((movie, index) => {
        // Build showtimes HTML string: <span>time <span class="lang">lang</span></span>
        const showtimesHtml = movie.showtimes.map(st => 
            `<span>${st.time} <span class="lang">${st.lang}</span></span>`
        ).join('');

        const cardHtml = `
            <article class="movie-card" 
                     data-rating="${movie.rating}" 
                     data-title="${movie.title}" 
                     data-image="${movie.image}" 
                     data-index="${index}">
                <img src="${movie.image}" alt="${movie.title} Poster">
                <div class="movie-info">
                    <h3 class="title">${movie.title}</h3>
                    <div class="showtimes">
                        ${showtimesHtml}
                    </div>
                    <div class="details">
                        <span>Release Date: ${movie.releaseDate}</span>
                    </div>
                </div>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', cardHtml);
    });
    
    // Re-attach click listeners to the newly rendered cards
    attachMovieCardListeners();
}

/* -------------------- Event listener attachment -------------------- */
function attachMovieCardListeners() {
    // Select all dynamically generated movie cards
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(card => {
        // Remove existing listener to prevent duplicates (important if render is called multiple times)
        card.removeEventListener('click', handleMovieCardClick);
        // Add the new listener
        card.addEventListener('click', handleMovieCardClick);
    });
}

function handleMovieCardClick(event) {
    const card = event.currentTarget;
    const movieTitle = document.getElementById('movie-title');
    const detailPoster = document.getElementById('detail-poster');

    gallery.style.display = 'none';
    movieDetails.style.display = 'block';

    // Set dynamic content based on card data
    movieTitle.textContent = card.getAttribute('data-title') || 'Selected Movie';
    detailPoster.src = card.getAttribute('data-image') || 'images/default.png';

    // Reset/Setup DSA components for this movie session
    seats = new Array(TOTAL_SEATS).fill("free");
    bookedList.head = null;
    undoStack = [];
    waitingQueue = [];
    
    // Example: book some sample seats to show booked/undo behavior
    [12, 13, 14, 45, 46].forEach(i => { seats[i] = 'booked'; bookedList.insert(i); });
    
    // Re-render the seat map
    buildSeatMap();
}

/* -------------------- DARK MODE TOGGLE (Unchanged) -------------------- */
document.addEventListener('DOMContentLoaded', () => {
        const toggleButton = document.getElementById('darkModeToggle');
        const body = document.body;
        const icon = toggleButton.querySelector('i');

        function updateToggleState(isDark) {
            if (isDark) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                // Using textContent property to reliably update text
                toggleButton.textContent = ' Light Mode'; 
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                toggleButton.textContent = ' Dark Mode';
            }
            // Re-add the icon since textContent overwrites everything inside
            toggleButton.prepend(icon);
        }

        const currentTheme = localStorage.getItem('theme');
        const isDarkInitial = currentTheme === 'dark';
        if (isDarkInitial) {
            body.classList.add('dark-mode');
        }
        updateToggleState(isDarkInitial);

        toggleButton.addEventListener('click', () => {
            const isDark = !body.classList.contains('dark-mode');
            body.classList.toggle('dark-mode');
            
            if (isDark) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            updateToggleState(isDark);
        });
        
        // Initial call to render the movies when the DOM is ready
        renderMovieCards();
    });
                            // Graph
function updateTreeAndGraphVisualization() {

  // Booked seats visualized as graph nodes chain (if you want to show adjacent relationships, you can expand this!)
  const booked = bookedList.getAll().map(n => n + 1); // 1-indexed seat numbers
  let graphStr = "<h3>Graph Example (Booked Seat Chain):</h3><pre style='font-size:1.1em;'>";
  if (booked.length > 0) {
    graphStr += booked.join(' — ');
  } else {
    graphStr += "None";
  }
  graphStr += "</pre>";
  document.getElementById('graph-vis').innerHTML = graphStr;
}
function renderSeatTreeVisualization() {
  const cols = 10, rows = 8;
  // We'll treat the seats as "heap order" (binary tree, level order)
  let out = "<h3 style='color:#644;'>Seats as Binary Tree (heap order):</h3><pre style='font-size:1em;'>";

  // Helper to draw levels
  for (let r = 0; r < rows; r++) {
    // Indent for tree shape
    let indent = "&nbsp;".repeat((rows - r) * 2);
    let levelSeats = [];
    for (let c = 0; c < cols; c++) {
      let idx = r * cols + c;
      // Show seat number and status
      let val = (idx+1) + (seats[idx]==='booked' ? "🟩" : seats[idx]==='free' ? "○" : "•");
      levelSeats.push(val);
    }
    out += `${indent}${levelSeats.join("   ")}\n`;
  }
  out += "</pre>";
  document.getElementById('seat-tree-vis').innerHTML = out;
}
// Search movie functionality
const searchInput = document.querySelector('.search-input');

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const movieCards = document.querySelectorAll('.movie-card');
  
  movieCards.forEach(card => {
    const title = card.getAttribute('data-title').toLowerCase();
    
    if (title.includes(searchTerm)) {
      card.style.display = 'block'; // Show matching movies
    } else {
      card.style.display = 'none'; // Hide non-matching movies
    }
  });
});
// ===== LOGIN/REGISTER/SEARCH FUNCTIONALITY =====

// Login
document.querySelector('.auth-button.login').addEventListener('click', () => {
  const username = prompt('Enter username:');
  const password = prompt('Enter password:');
  if (username && password) {
    alert(`✅ Welcome, ${username}!`);
    // Hide details and show gallery
    document.getElementById('movie-details').style.display = 'none';
    document.getElementById('movie-gallery').style.display = 'block';
  }
});


// Register
document.querySelector('.auth-button.register').addEventListener('click', () => {
  const username = prompt('Choose username:');
  const email = prompt('Enter email:');
  const password = prompt('Choose password:');
  if (username && email && password) {
    alert(`✅ Registered successfully, ${username}!`);
    // Hide details and show gallery
    document.getElementById('movie-details').style.display = 'none';
    document.getElementById('movie-gallery').style.display = 'block';
  }
});


// Search Movies
// Login button functionality
document.querySelector('.auth-button.login').addEventListener('click', () => {
  const username = prompt('Enter your username:');
  const password = prompt('Enter your password:');
  
  if (username && password) {
    alert(`✅ Welcome back, ${username}!`);
    // You can add more logic here (store user data, redirect, etc.)
  } else {
    alert('❌ Login cancelled or invalid credentials.');
  }
});

// Register button functionality
document.querySelector('.auth-button.register').addEventListener('click', () => {
  const username = prompt('Choose a username:');
  const email = prompt('Enter your email:');
  const password = prompt('Choose a password:');
  
  if (username && email && password) {
    alert(`✅ Account created for ${username}!`);
    // You can add more logic here (save to database, etc.)
  } else {
    alert('❌ Registration incomplete.');
  }
});


/* -------------------- DSA Structures and Logic -------------------- */

// Array of 80 seats --> "free" or "booked"
const TOTAL_SEATS = 80; // 10 columns x 8 rows
let seats = new Array(TOTAL_SEATS).fill("free");

// Queue -> waiting list: stores seat INDEXES (Numbers)
let waitingQueue = []; 

// Stack -> undo cancellations: stores seat INDEXES (Numbers)
let undoStack = [];    

// Linked List for booked seats (stores seat INDEXES)
class Node {
  constructor(seatNo) {
    this.seatNo = seatNo;
    this.next = null;
  }
}
class LinkedList {
  constructor() { this.head = null; }
  insert(seatNo) {
    if (this.contains(seatNo)) return;
    const node = new Node(seatNo);
    if (!this.head) { this.head = node; return; }
    let t = this.head;
    while (t.next) t = t.next;
    t.next = node;
  }
  delete(seatNo) {
    if (!this.head) return;
    if (this.head.seatNo === seatNo) { this.head = this.head.next; return; }
    let t = this.head;
    while (t.next && t.next.seatNo !== seatNo) t = t.next;
    if (t.next) t.next = t.next.next;
  }
  contains(seatNo) {
    let t = this.head;
    while (t) { if (t.seatNo === seatNo) return true; t = t.next; }
    return false;
  }
  getAll() {
    const out = [];
    let t = this.head;
    while (t) { out.push(t.seatNo); t = t.next; }
    return out;
  }
}
const bookedList = new LinkedList();

/* -------------------- Searching & Sorting -------------------- */
function bubbleSort(arr) {
  const a = arr.slice();
  const n = a.length;
  for (let i=0;i<n-1;i++){
    for (let j=0;j<n-i-1;j++){
      if (a[j] > a[j+1]) { const tmp = a[j]; a[j]=a[j+1]; a[j+1]=tmp; }
    }
  }
  return a;
}
function binarySearch(sortedArr, target) {
  let l=0, r=sortedArr.length-1;
  while (l<=r) {
    const mid = Math.floor((l+r)/2);
    if (sortedArr[mid] === target) return true;
    if (sortedArr[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return false;
}

/* -------------------- UI elements -------------------- */
const movieDetails = document.getElementById('movie-details');
const gallery = document.getElementById('movie-gallery-container'); 
const seatMap = document.getElementById('seat-map');
const seatSummary = document.getElementById('seat-summary');
const backBtn = document.getElementById('back-btn');
const buyBtn = document.getElementById('buy-btn');
const undoBtn = document.getElementById('undo-btn');
const showListBtn = document.getElementById('show-list-btn');
const dsDebug = document.getElementById('ds-debug');

/* -------------------- Helper: recommended seats -------------------- */
function computeRecommendedIndices() {
  const rec = new Set();
  const cols = 10;
  for (let r = 0; r < TOTAL_SEATS / cols; r++) {
    const base = r * cols;
    // Indices 3, 4, 5, 6 (middle columns) are recommended
    [3, 4, 5, 6].forEach(c => { 
      const idx = base + c;
      if (idx >= 0 && idx < TOTAL_SEATS) rec.add(idx);
    });
  }
  return rec;
}

/* -------------------- Build seat map (UI) -------------------- */
function buildSeatMap() {
  seatMap.innerHTML = '';
  const recSet = computeRecommendedIndices();

  for (let i = 0; i < TOTAL_SEATS; i++) {
    const div = document.createElement('div');
    div.classList.add('seat');
    div.dataset.index = i;
    div.textContent = (i+1);

    if (seats[i] === 'booked') {
      div.classList.add('booked');
    } else {
      if (recSet.has(i)) div.classList.add('recommended');
      else div.classList.add('free');
    }
    // If seat is in the waiting queue, visually mark it (optional, for debugging)
    if (waitingQueue.includes(i)) {
         div.style.border = '2px dashed blue';
    }


    div.setAttribute('role','button');
    div.setAttribute('aria-pressed','false');

    seatMap.appendChild(div);
  }

  updateSummary();
  updateDebugInfo();
updateTreeAndGraphVisualization();
renderSeatTreeVisualization();

}

/* -------------------- Update summary & debug -------------------- */
function updateSummary() {
  const selCount = seatMap.querySelectorAll('.seat.selected').length;
  seatSummary.textContent = `You have selected ${selCount} seat(s) for $${selCount * 12}`;
}
function updateDebugInfo() {
  const booked = bookedList.getAll();
  const sortedBooked = bubbleSort(booked.slice()).map(n => n+1);
  dsDebug.innerHTML = `
    <div><strong>Array seats:</strong> ${seats.filter(s=>s==='free').length} free / ${seats.filter(s=>s==='booked').length} booked</div>
    <div><strong>LinkedList (booked):</strong> [${booked.length ? sortedBooked.join(', ') : 'none'}]</div>
    <div><strong>Waiting Queue:</strong> [${waitingQueue.length ? waitingQueue.map(n=>n+1).join(', ') : 'empty'}]</div>
    <div><strong>Undo Stack:</strong> [${undoStack.length ? undoStack.map(n=>n+1).join(', ') : 'empty'}]</div>
  `;
}

/* -------------------- Seat click behavior -------------------- */
seatMap.addEventListener('click', (ev) => {
  const el = ev.target;
  if (!el.classList.contains('seat')) return;
  const idx = Number(el.dataset.index);

  if (seats[idx] === 'booked') {
    alert('Seat already booked (occupied). Right-click a booked seat to cancel it (for demo).');
    return;
  }

  const recSet = computeRecommendedIndices();

  if (el.classList.contains('selected')) {
    el.classList.remove('selected');
    // Restore initial class (recommended or free)
    if (recSet.has(idx)) el.classList.add('recommended'); else el.classList.add('free');
  } else {
    el.classList.remove('free'); el.classList.remove('recommended');
    el.classList.add('selected');
  }
  updateSummary();
});

/* Right click -> cancel booked seat (Stack demo) */
seatMap.addEventListener('contextmenu', (ev) => {
  ev.preventDefault();
  const el = ev.target;
  if (!el.classList.contains('seat')) return;
  const idx = Number(el.dataset.index);

  if (seats[idx] !== 'booked') {
    alert('You can only cancel an already booked (occupied) seat via right-click in this demo.');
    return;
  }

  // 1. Free up seat in array and linked list
  seats[idx] = 'free';
  bookedList.delete(idx);
  
  // 2. Check waiting queue
  if (waitingQueue.length > 0) {
    const nextSeatIndex = waitingQueue.shift(); 
    // Re-book the freed seat to the waiting customer (using the newly freed seat's index)
    seats[idx] = 'booked';
    bookedList.insert(idx);
    alert(`Cancelled. But immediately assigned seat ${idx+1} to customer who was waiting for seat ${nextSeatIndex+1} in the queue.`);
  } else {
    // 3. Push to Undo Stack only if not immediately reassigned
    undoStack.push(idx);
    alert(`✅ Seat ${idx+1} cancelled and pushed to Undo Stack.`);
  }

  buildSeatMap();
});

/* -------------------- Buy seats -------------------- */
buyBtn.addEventListener('click', () => {
  const selectedEls = Array.from(seatMap.querySelectorAll('.seat.selected'));
  if (selectedEls.length === 0) { alert('Please select at least one seat to buy.'); return; }

  let conflictedSeats = 0;

  selectedEls.forEach(el => {
    const idx = Number(el.dataset.index);
    // Since selected seats are 'free' or 'recommended', they cannot be 'booked' by array state, 
    // but we can simulate a conflict (e.g., race condition) by checking if another user booked it just now.
    // For this demo, let's simplify and just book the selected seats.
    
    if (seats[idx] === 'booked') {
        // This simulates a race condition where the seat was booked between selection and clicking 'Buy'
        waitingQueue.push(idx); 
        conflictedSeats++;
    } else {
        // Book the seat
        seats[idx] = 'booked';
        bookedList.insert(idx);
    }
  });
  buildSeatMap();
  
  if (conflictedSeats > 0) {
    alert(`⚠️ Booking completed. ${selectedEls.length - conflictedSeats} seats confirmed. ${conflictedSeats} seats were conflicted and added to the Waiting Queue.`);
  } else {
    alert('✅ Booking successful!');
  }
});

/* -------------------- Undo cancellation (stack) -------------------- */
undoBtn.addEventListener('click', () => {
  if (undoStack.length === 0) { alert('Nothing to undo (stack empty).'); return; }
  const last = undoStack.pop();

  if (seats[last] === 'booked') {
    alert(`Cannot undo: seat ${last+1} was immediately reassigned from the waiting queue or booked by another customer.`);
  } else {
    seats[last] = 'booked';
    bookedList.insert(last);
    alert(`🔁 Undo successful: Seat ${last+1} restored.`);
  }
  buildSeatMap();
});
/* -------------------- Show booked list (sorted) -------------------- */
showListBtn.addEventListener('click', () => {
  const booked = bookedList.getAll();
  if (booked.length === 0) { alert('No seats booked yet.'); return; }
  // Sort the list of indices, then add 1 to convert to seat numbers
  const out = bubbleSort(booked).map(n => n+1); 
  alert('Booked seats (sorted): ' + out.join(', '));
});

/* -------------------- Back button -------------------- */
backBtn.addEventListener('click', () => {
  movieDetails.style.display = 'none';
  gallery.style.display = 'flex';
});


