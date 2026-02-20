const apiKey = "53ef91eb";
const baseURL = "https://www.omdbapi.com/";

const modal = document.getElementById("movieModal");
const modalDetails = document.getElementById("modalDetails");
const closeModal = document.getElementById("closeModal");

const movieContainer = document.getElementById("movies");
const searchInput = document.getElementById("search");

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

        /* Open Details Modal */
        movieDiv.addEventListener("click", () => {
            getMovieDetails(movie.imdbID);
        });

        /* Watchlist Button */
        const watchBtn = movieDiv.querySelector(".watch-btn");
        watchBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent modal opening
            addToWatchlist(movie.imdbID);
        });

        movieContainer.appendChild(movieDiv);
    });
}

/* =========================
   MOVIE DETAILS MODAL
========================= */
let movieCache = {};

async function getMovieDetails(id) {

    // Open modal instantly
    modal.style.display = "block";
    modalDetails.innerHTML = "<h2>Loading...</h2>";

    // If already fetched before, use cache
    if (movieCache[id]) {
        displayDetails(movieCache[id]);
        return;
    }

    try {
        const res = await fetch(`${baseURL}?apikey=${apiKey}&i=${id}`);
        const data = await res.json();

        movieCache[id] = data; // Save in cache
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
// async function getMovieDetails(id) {
//     const res = await fetch(`${baseURL}?apikey=${apiKey}&i=${id}`);
//     const data = await res.json();

//     modalDetails.innerHTML = `
//         <h2>${data.Title}</h2>
//         <img src="${data.Poster}" width="200">
//         <p><b>⭐ IMDb:</b> ${data.imdbRating}</p>
//         <p><b>🎭 Genre:</b> ${data.Genre}</p>
//         <p><b>🎬 Director:</b> ${data.Director}</p>
//         <p><b>👥 Actors:</b> ${data.Actors}</p>
//         <p><b>📝 Plot:</b> ${data.Plot}</p>
//     `;

//     modal.style.display = "block";
// }

// /* Close Modal */
// closeModal.onclick = () => {
//     modal.style.display = "none";
// };

// window.onclick = (event) => {
//     if (event.target === modal) {
//         modal.style.display = "none";
//     }
// };

/* =========================
   WATCHLIST (LOCAL STORAGE)
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

/* Optional: Show Watchlist */
async function showWatchlist() {
    movieContainer.innerHTML = "";
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    if (watchlist.length === 0) {
        movieContainer.innerHTML = "<h2>Your Watchlist is Empty</h2>";
        return;
    }

    for (let id of watchlist) {
        const res = await fetch(`${baseURL}?apikey=${apiKey}&i=${id}`);
        const data = await res.json();

        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie");

        movieDiv.innerHTML = `
            <img src="${data.Poster}">
            <h3>${data.Title}</h3>
            <p>⭐ ${data.imdbRating}</p>
        `;

        movieContainer.appendChild(movieDiv);
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
// Close button click
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close when clicking outside modal content
modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

/* Default Load */
getMovies("Avengers");