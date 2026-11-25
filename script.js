
import { createStorage } from "./js/storage.js";
import { MovieManager } from "./js/movieManager.js";

const manager = new MovieManager(createStorage());

const movieForm = document.getElementById("movieForm");
const movieTitle = document.getElementById("movieTitle");
const movieList = document.getElementById("movieList");
const message = document.getElementById("message");
const emptyMessage = document.getElementById("emptyMessage");
const noResults = document.getElementById("noResults");

const watchlistMessage =
    document.getElementById("watchlistMessage");

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const overlay = document.getElementById("overlay");

const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const resetFilters = document.getElementById("resetFilters");
const resultsCount = document.getElementById("resultsCount");

let currentSearch = "";
let currentFilter = "all";
let currentPage = "dashboard";

// Navigation

function updateNavigation() {

    document.querySelectorAll(".nav-link").forEach(link => {

        const correctPage =
            link.dataset.page === currentPage;

        const correctFilter =
            currentPage !== "watchlist" ||
            link.dataset.filter === currentFilter;

        link.classList.toggle(
            "active",
            correctPage && correctFilter
        );

    });
}

function showPage(pageId) {

    currentPage = pageId;

    document.querySelectorAll(".page").forEach(page => {
        page.hidden = page.id !== pageId;
    });

    updateNavigation();
    closeMenu();

    window.scrollTo(0, 0);
}

document.querySelectorAll("[data-page]").forEach(button => {

    button.addEventListener("click", () => {

        if (button.dataset.page === "watchlist") {

            currentSearch = "";
            searchInput.value = "";

            setFilter(button.dataset.filter || "all");

            watchlistMessage.textContent = "";
        }

        showPage(button.dataset.page);
    });
});

// Mobile Navigation

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

        sidebar.classList.add("open");
        overlay.classList.add("active");

        menuToggle.textContent = "✕";
        menuToggle.setAttribute("aria-expanded", "true");
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

    document.getElementById("ratedMovies").textContent =
        stats.rated;

    const average = stats.rated > 0
        ? stats.average.toFixed(1)
        : "—";

    document.getElementById("averageRating").textContent =
        average;

    document.getElementById("quickAverage").textContent =
        average;

    document.getElementById("progressBar").style.width =
        stats.progress + "%";

    document.getElementById("progressText").textContent =
        stats.progress + "% of your watchlist completed";
}

// Movie Search

searchInput.addEventListener("input", () => {

    currentSearch = searchInput.value;

    watchlistMessage.textContent = "";

    displayMovies();
});

clearSearch.addEventListener("click", () => {

    searchInput.value = "";
    currentSearch = "";

    watchlistMessage.textContent = "";

    displayMovies();

    searchInput.focus();
});

// Movie Filters

function setFilter(filter) {

    currentFilter = filter;

    document.querySelectorAll(".filter-btn").forEach(button => {

        const selected =
            button.dataset.movieFilter === filter;

        button.classList.toggle("active", selected);

        button.setAttribute(
            "aria-pressed",
            String(selected)
        );

    });

    updateNavigation();
    displayMovies();
}

document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", () => {

        watchlistMessage.textContent = "";

        setFilter(button.dataset.movieFilter);
    });
});

resetFilters.addEventListener("click", () => {

    searchInput.value = "";
    currentSearch = "";

    watchlistMessage.textContent = "";

    setFilter("all");
});

// Movie Rating Section

function createRatingSection(movie, index) {

    const section = document.createElement("div");
    section.className = "rating-section";

    const label = document.createElement("p");
    label.className = "rating-label";
    label.textContent = "YOUR RATING";

    const stars = document.createElement("div");
    stars.className = "rating-stars";

    for (let rating = 1; rating <= 5; rating++) {

        const star = document.createElement("button");

        star.type = "button";
        star.className = "star-btn";

        star.textContent = rating <= movie.rating
            ? "★"
            : "☆";

        star.classList.toggle(
            "selected",
            rating <= movie.rating
        );

        star.setAttribute(
            "aria-label",
            "Rate " + movie.title + " " +
            rating + " out of 5 stars"
        );

        star.setAttribute(
            "aria-pressed",
            String(rating === movie.rating)
        );

        star.addEventListener("click", () => {

            try {

                manager.rateMovie(index, rating);

                displayMovies();

                showMessage(
                    watchlistMessage,
                    "Movie rated successfully!",
                    "success"
                );

            } catch (error) {

                showMessage(
                    watchlistMessage,
                    error.message,
                    "error"
                );
            }
        });

        stars.appendChild(star);
    }

    const value = document.createElement("span");
    value.className = "rating-value";

    value.textContent = movie.rating > 0
        ? movie.rating + " / 5"
        : "Not rated";

    stars.appendChild(value);
    section.append(label, stars);

    return section;
}

// Create Movie Card

function createMovieCard(movie, index) {

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

    // Watched Status Button

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

        try {

            const watched = manager.toggleWatched(index);

            displayMovies();

            showMessage(
                watchlistMessage,
                watched
                    ? "Movie marked as watched!"
                    : "Movie marked as unwatched!",
                "success"
            );

        } catch (error) {

            showMessage(
                watchlistMessage,
                error.message,
                "error"
            );
        }
    });

    // Remove Movie Button

    const removeButton = document.createElement("button");

    removeButton.className = "remove-btn";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {

        try {

            manager.removeMovie(index);

            displayMovies();

            showMessage(
                watchlistMessage,
                "Movie removed successfully!",
                "success"
            );

        } catch (error) {

            showMessage(
                watchlistMessage,
                error.message,
                "error"
            );
        }
    });

    actions.append(statusButton, removeButton);

    li.append(
        header,
        actions,
        createRatingSection(movie, index)
    );

    return li;
}

// Display Movies

function displayMovies() {

    movieList.innerHTML = "";

    const filteredMovies = manager.getFilteredMovies(
        currentSearch,
        currentFilter
    );

    const total = manager.movies.length;

    emptyMessage.hidden = total !== 0;

    noResults.hidden =
        total === 0 || filteredMovies.length !== 0;

    resultsCount.textContent =
        "Showing " + filteredMovies.length +
        " of " + total + " movies";

    filteredMovies.forEach(movie => {

        // Use the original index so filtered actions
        // update the correct saved movie.

        const originalIndex =
            manager.movies.indexOf(movie);

        movieList.appendChild(
            createMovieCard(movie, originalIndex)
        );
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
