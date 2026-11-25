
// Everest Movie - Sprint 1

// HTML Elements
const movieForm = document.getElementById("movieForm");
const movieTitle = document.getElementById("movieTitle");
const movieList = document.getElementById("movieList");
const message = document.getElementById("message");
const emptyMessage = document.getElementById("emptyMessage");
const watchlistMessage = document.getElementById("watchlistMessage");

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const overlay = document.getElementById("overlay");

// Load Saved Movies
let movies = JSON.parse(localStorage.getItem("movies")) || [];

// Support movies saved in the previous version
movies = movies.map(movie => {
    if (typeof movie === "string") {
        return {
            title: movie,
            dateAdded: null
        };
    }

    return movie;
});

// Save Movies
function saveMovies() {
    localStorage.setItem("movies", JSON.stringify(movies));
}

// Navigation
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.hidden = page.id !== pageId;
        page.classList.toggle("active", page.id === pageId);
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.page === pageId
        );
    });

    closeMenu();
    window.scrollTo(0, 0);
}

// Navigation Buttons
document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

// Mobile Sidebar
function openMenu() {
    sidebar.classList.add("open");
    overlay.classList.add("active");
    menuToggle.textContent = "✕";
    menuToggle.setAttribute("aria-expanded", "true");
}

function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) {
        closeMenu();
    } else {
        openMenu();
    }
});

overlay.addEventListener("click", closeMenu);

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

// Dashboard Statistics
function updateDashboard() {
    const total = movies.length;
    const today = new Date().toDateString();

    const addedToday = movies.filter(movie => {
        return movie.dateAdded &&
            new Date(movie.dateAdded).toDateString() === today;
    }).length;

    document.getElementById("totalMovies").textContent = total;
    document.getElementById("recentMovies").textContent = addedToday;
    document.getElementById("sidebarCount").textContent = total;
    document.getElementById("quickTotal").textContent = total;
}

// Display Messages
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = type;
}

// Display Watchlist
function displayMovies() {
    movieList.innerHTML = "";

    emptyMessage.style.display =
        movies.length === 0 ? "block" : "none";

    movies.forEach((movie, index) => {
        const li = document.createElement("li");

        const title = document.createElement("span");
        title.textContent = "🎬 " + movie.title;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.className = "remove-btn";

        removeButton.addEventListener("click", () => {
            removeMovie(index);
        });

        li.appendChild(title);
        li.appendChild(removeButton);
        movieList.appendChild(li);
    });

    updateDashboard();
}

// Add Movie
movieForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = movieTitle.value.trim();

    // Empty Title Validation
    if (title === "") {
        showMessage(
            message,
            "Please enter a movie title.",
            "error"
        );
        return;
    }

    // Duplicate Movie Validation
    const duplicate = movies.some(movie =>
        movie.title.toLowerCase() === title.toLowerCase()
    );

    if (duplicate) {
        showMessage(
            message,
            "This movie is already in your watchlist.",
            "error"
        );
        return;
    }

    // Create Movie
    const newMovie = {
        title: title,
        dateAdded: new Date().toISOString()
    };

    movies.push(newMovie);

    saveMovies();
    displayMovies();

    showMessage(
        message,
        "Movie added successfully!",
        "success"
    );

    watchlistMessage.textContent = "";
    movieTitle.value = "";
});

// Remove Movie
function removeMovie(index) {
    movies.splice(index, 1);

    saveMovies();
    displayMovies();

    showMessage(
        watchlistMessage,
        "Movie removed successfully!",
        "success"
    );
}

// Initialize Application
displayMovies();
showPage("dashboard");
