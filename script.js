const apiKey = "53ef91eb";
const baseURL = "https://www.omdbapi.com/";

const modal = document.getElementById("movieModal");
const modalDetails = document.getElementById("modalDetails");
const closeModal = document.getElementById("closeModal");

const movieContainer = document.getElementById("movies");
const searchInput = document.getElementById("search");

let movieCache = {};

/* =========================
   FETCH MOVIES (SEARCH)
========================= */
async function getMovies(searchTerm) {
    const res = await fetch(`${baseURL}?apikey=${apiKey}&s=${searchTerm}`);
    const data = await res.json();

    if (data.Response === "True") {
        showMovies(data.Search);
    } else {
        movieContainer.innerHTML = "<h2>No Movies Found</h2>";
    }
}

/* =========================
   DISPLAY MOVIES
========================= */
function showMovies(movies) {
    movieContainer.innerHTML = "";

    movies.forEach(movie => {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie");

        movieDiv.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}">
            <h3>${movie.Title}</h3>
            <p>📅 ${movie.Year}</p>
            <button class="watch-btn">❤️ Watchlist</button>
        `;

        movieDiv.addEventListener("click", () => {
            getMovieDetails(movie.imdbID);
        });

        const watchBtn = movieDiv.querySelector(".watch-btn");
        watchBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            addToWatchlist(movie.imdbID);
        });

        movieContainer.appendChild(movieDiv);
    });
}

/* =========================
   MOVIE DETAILS MODAL
========================= */
async function getMovieDetails(id) {

    // Open modal properly
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    modalDetails.innerHTML = "<h2>Loading...</h2>";

    if (movieCache[id]) {
        displayDetails(movieCache[id]);
        return;
    }

    try {
        const res = await fetch(`${baseURL}?apikey=${apiKey}&i=${id}`);
        const data = await res.json();

        movieCache[id] = data;
        displayDetails(data);

    } catch (error) {
        modalDetails.innerHTML = "<h2>Error loading details</h2>";
    }
}

function displayDetails(data) {
    modalDetails.innerHTML = `
        <h2>${data.Title}</h2>
        <img src="${data.Poster}" width="200">
        <p><b>⭐ IMDb:</b> ${data.imdbRating}</p>
        <p><b>🎭 Genre:</b> ${data.Genre}</p>
        <p><b>🎬 Director:</b> ${data.Director}</p>
        <p><b>👥 Actors:</b> ${data.Actors}</p>
        <p><b>📝 Plot:</b> ${data.Plot}</p>
    `;
}

/* =========================
   CLOSE MODAL (FIXED)
========================= */
function closeModalFunction() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

closeModal.addEventListener("click", closeModalFunction);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModalFunction();
    }
});

/* =========================
   WATCHLIST
========================= */
function addToWatchlist(id) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    if (!watchlist.includes(id)) {
        watchlist.push(id);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        alert("Added to Watchlist ❤️");
    } else {
        alert("Already in Watchlist");
    }
}

/* =========================
   SEARCH EVENT
========================= */
searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            getMovies(searchTerm);
        }
    }
});

/* Default Load */
getMovies("Avengers");
