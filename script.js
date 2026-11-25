
import { createStorage } from "./js/storage.js";
import { MovieManager } from "./js/movieManager.js";

const manager = new MovieManager(createStorage());

const movieForm = document.getElementById("movieForm");
const movieTitle = document.getElementById("movieTitle");
const movieList = document.getElementById("movieList");
const message = document.getElementById("message");
const emptyMessage = document.getElementById("emptyMessage");

const watchlistMessage =
    document.getElementById("watchlistMessage");

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const overlay = document.getElementById("overlay");

// Navigation

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.hidden = page.id !== pageId;
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

document.querySelectorAll("[data-page]").forEach(button => {

    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });

});

// Mobile Navigation

function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
    menuToggle.textContent = "☰";
}

menuToggle.addEventListener("click", () => {

    if (sidebar.classList.contains("open")) {
        closeMenu();
    } else {
        sidebar.classList.add("open");
        overlay.classList.add("active");
        menuToggle.textContent = "✕";
    }

});

overlay.addEventListener("click", closeMenu);

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeMenu();
    }

});

// Messages

function showMessage(element, text, type) {
    element.textContent = text;
    element.className = type;
}

// Dashboard Statistics

function updateDashboard() {

    const stats = manager.getStats();

    document.getElementById("totalMovies").textContent =
        stats.total;

    document.getElementById("recentMovies").textContent =
        stats.addedToday;

    document.getElementById("watchedMovies").textContent =
        stats.watched;

    document.getElementById("unwatchedMovies").textContent =
        stats.unwatched;

    document.getElementById("sidebarCount").textContent =
        stats.total;

    document.getElementById("quickTotal").textContent =
        stats.total;

    document.getElementById("quickWatched").textContent =
        stats.watched;

    document.getElementById("progressBar").style.width =
        stats.progress + "%";

    document.getElementById("progressText").textContent =
        stats.progress + "% of your watchlist completed";

}

// Display Movies

function displayMovies() {

    movieList.innerHTML = "";

    emptyMessage.hidden = manager.movies.length !== 0;

    manager.movies.forEach((movie, index) => {

        const li = document.createElement("li");

        const header = document.createElement("div");
        header.className = "movie-card-header";

        const icon = document.createElement("span");
        icon.className = "movie-icon";
        icon.textContent = "🎬";

        const info = document.createElement("div");
        info.className = "movie-info";

        const title = document.createElement("h3");
        title.textContent = movie.title;

        const date = document.createElement("p");

        date.textContent = movie.dateAdded
            ? "Added " + new Date(
                movie.dateAdded
            ).toLocaleDateString()
            : "Saved Movie";

        info.append(title, date);
        header.append(icon, info);

        const actions = document.createElement("div");
        actions.className = "movie-actions";

        // Watched Button

        const statusButton = document.createElement("button");

        statusButton.className = "status-btn";

        statusButton.classList.toggle(
            "watched",
            movie.watched
        );

        statusButton.textContent = movie.watched
            ? "✓ Watched"
            : "Mark as Watched";

        statusButton.setAttribute(
            "aria-pressed",
            String(movie.watched)
        );

        statusButton.addEventListener("click", () => {

            const watched = manager.toggleWatched(index);

            displayMovies();

            showMessage(
                watchlistMessage,
                watched
                    ? "Movie marked as watched!"
                    : "Movie marked as unwatched!",
                "success"
            );

        });

        // Remove Button

        const removeButton = document.createElement("button");

        removeButton.className = "remove-btn";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {

            manager.removeMovie(index);

            displayMovies();

            showMessage(
                watchlistMessage,
                "Movie removed successfully!",
                "success"
            );

        });

        actions.append(statusButton, removeButton);

        li.append(header, actions);

        movieList.appendChild(li);

    });

    updateDashboard();

}

// Add Movie

movieForm.addEventListener("submit", event => {

    event.preventDefault();

    try {

        manager.addMovie(movieTitle.value);

        movieTitle.value = "";

        displayMovies();

        showMessage(
            message,
            "Movie added successfully!",
            "success"
        );

    } catch (error) {

        showMessage(
            message,
            error.message,
            "error"
        );

    }

});

// Initialize Website

displayMovies();
showPage("dashboard");
