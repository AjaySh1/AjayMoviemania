const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3ba758977c84617b0c5934c60b2a67b4&include_adult=false&page=';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3ba758977c84617b0c5934c60b2a67b4&include_adult=false&query=';
const WATCH_PROVIDERS_API = (id) => `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=3ba758977c84617b0c5934c60b2a67b4`;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

var prev_url = API_URL;

// Define a global variable to store movies and watchlist

// Function for fetching movies
const fetchMovies = async (page, url) => {
    const response = await fetch(url + `${page}`);
    const data = await response.json();
    return data.results;
};

const fetchAllMovies = async (url) => {
    let allMovies = [];
    const totalPages = 2; // Number of pages to fetch

    for (let page = 1; page <= totalPages; page++) {
        const movies = await fetchMovies(page, url);
        allMovies = allMovies.concat(movies);
    }

    return allMovies;
};

// Get initial movies
fetchAllMovies(API_URL)
    .then(movies => { showMovies(movies); })
    .catch(error => console.error('Error fetching movies:', error));

// Function to fetch watch providers for a movie
const fetchWatchProviders = async (id) => {
    const response = await fetch(WATCH_PROVIDERS_API(id));
    const data = await response.json();
    return data.results;
};


// Function to generate HTML for watch providers
function getWatchProvidersHTML(watchProviders) {
    if (!watchProviders || !watchProviders.US || !watchProviders.US.flatrate) {
        return `<div class="watch-providers" style="color:black;"><h4 style="color:#960606;text-decoration:underline;">Watch on:</h4>*Not available on any platform</div>`;
    }
    const providers = watchProviders.US.flatrate || [];
    const providersHTML = providers.map(provider => {
        if (provider.logo_path) {
            return `<img src="https://image.tmdb.org/t/p/w92${provider.logo_path}" title="${provider.provider_name}" style="width: 40px; height: 40px; margin-right: 7px;">`;
        } else {
            return `<span style="margin-right: auto; font-size: 14px;">${provider.provider_name}</span>`;
        }
    }).join('');
    return providers.length > 0 ? `<div class="watch-providers"><h4 style="color:#960606;text-decoration:underline;">Watch on:</h4>${providersHTML}</div>` : '';
}



// Function for showing movies
async function showMovies(moviesArray) {
    movies = moviesArray; // Store the movies globally
    main.innerHTML = '';

    for (const movie of movies) {
        const { title, poster_path, vote_average, overview, id } = movie;

        const watchProviders = await fetchWatchProviders(id);
        const watchProvidersHTML = getWatchProvidersHTML(watchProviders);

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                ${watchProvidersHTML}
                <button class="watchlist-btn" data-id="${id}" >Add to Watchlist</button>
            </div>
        `;
        main.appendChild(movieEl);
    }

   // Event listener for "Add to Watchlist" button
document.querySelectorAll('.watchlist-btn').forEach(button => {
    button.addEventListener('click', addToWatchlist);
});
}
async function showMovies1(moviesArray) {
    movies = moviesArray; // Store the movies globally
    main.innerHTML = '';

    for (const movie of movies) {
        const { title, poster_path, vote_average, overview, id } = movie;

        const watchProviders = await fetchWatchProviders(id);
        const watchProvidersHTML = getWatchProvidersHTML(watchProviders);

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                ${watchProvidersHTML}
             <button class="remove-btn" data-id="${id}" >Remove</button>
            </div>
        `;
        main.appendChild(movieEl);
    }

   // Event listener for "Add to Watchlist" button
  document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', addremovelist);
 });
}

// Function for generating class based on rating
function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}



async function addToWatchlist(event) {
    const button = event.target;

    // Extract movie details from the button's parent element
    const movieElement = button.closest('.movie');
    const movie = {
        id: button.dataset.id,
        title: movieElement.querySelector('h3').textContent,
        poster_path: movieElement.querySelector('img').getAttribute('src'),  // Fix this line
        overview: movieElement.querySelector('.overview').textContent.trim(),
        vote_average: movieElement.querySelector('.movie-info span').textContent // Corrected this line
    };

    try {
        const response = await fetch('/add-to-watchlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movie }), // Send the correct movie data
        });

        if (response.ok) {
            alert("Movie added to watchlist!");
        } else {
            const errorText = await response.text();
            alert(`Error: ${errorText}`);
        }
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        alert("An error occurred while adding the movie to the watchlist.");
    }
}



// function for showing watchlist
async function showWatchlist() {
    try {
        const response = await fetch('/watchlist');
        const data = await response.json();

        if (data.watchlist.length > 0) {
            showMovies1(data.watchlist);
    //         for (const movie of data.watchlist) {
    //     const { id,title, poster, overview } = movie;

    //     // Fetch watch providers asynchronously
    //     let watchProvidersHTML = '';
    //     try {
    //         const watchProviders = await fetchWatchProviders(id);
    //         watchProvidersHTML = getWatchProvidersHTML(watchProviders);
    //     } catch (error) {
    //         console.error(`Error fetching watch providers for movie ID ${id}:`, error);
    //     }

    //     const movieEl = document.createElement('div');
    //     movieEl.classList.add('movie');

    //     movieEl.innerHTML = `
    //         <img src="${IMG_PATH + poster}" alt="${title}">
    //         <div class="movie-info">
    //             <h3>${title}</h3>
    //         </div>
    //         <div class="overview">
    //             <h3>Overview</h3>
    //             ${watchProvidersHTML}
    //             <button class="remove-btn" data-id="${id}" >Remove</button>
    //         </div>
    //     `;
    //     main.appendChild(movieEl);
    // }

   
        } else {
            alert("Your watchlist is empty.");
        }
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        alert("Error fetching watchlist.");
    }

    
}

// Function for removing from watchlist (frontend)
async function addremovelist(event) {
    const button = event.target; // Get the clicked button
    const movieId = button.dataset.id; // Extract movie ID from the data-id attribute

    try {
        // Send a DELETE request to the backend
        const response = await fetch('/remove-from-watchlist', {
            method: 'DELETE', // Using DELETE for removal
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: movieId }), // Send movie ID to the server
        });

        if (response.ok) {
            alert("Movie removed from watchlist!"); // Success message

            // Remove the movie element from the DOM
            const movieElement = button.closest('.movie'); // Find the closest parent with the class 'movie'
            if (movieElement) {
                movieElement.remove(); // Remove the element from the page
            }
        } else {
            const errorText = await response.text(); // Get error message
            alert(`Error: ${errorText}`);
        }
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        alert("An error occurred while removing the movie.");
    }
}


// search   code starts

const getMovies = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0) {
            showMovies(data.results);
        } else {
            main.innerHTML = `
               <h2 style="color: white;">No results found &#129488;</h2> `;
 
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
        main.innerHTML = `<h2>Error fetching search results. Please try again later.</h2>`;
    }
};
// Event listener for search form
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);
        search.value = '';
    } else {
        window.location.reload();
    }
});

// search code ends

var flag = true;
document.getElementById('sidebar-toggle').addEventListener('click', function () {
    if (flag) {
        this.innerHTML = "&#10005;";
        flag = false;
    } else {
        flag = true;
        this.innerHTML = "☰";
    }
    document.body.classList.toggle('sidebar-visible');
});


// JS for filter dropdown
document.addEventListener("DOMContentLoaded", () => {
    let filterButton = document.getElementById("filter");
    let dropdownContent = document.querySelector(".dropdown-content");
    let dropdown = document.querySelector(".dropdown");
    let addto = document.getElementById("add-to-watchlist");

    filterButton.addEventListener("click", () => {
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
            addto.style.marginTop = "15px";
            dropdown.style.backgroundColor = '';
        } else {
            dropdownContent.style.display = "block";
            addto.style.marginTop = "110px";
            dropdown.style.backgroundColor = '#960606';
        }
    });
});

const handleLinkClick = (url, element) => {
    fetchAllMovies(url)
        .then(movies => { showMovies(movies); })
        .catch(error => console.error('Error fetching movies:', error));

    // Update active link background color
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.classList.remove('active');
    });
    element.classList.add('active');
};

// JavaScript for dropdown content
const sortOptions = {
    'revenue': 'revenue.desc',
    'popularity': 'popularity.desc',
    'rating': 'vote_average.desc'
};

function handleSortClick(event) {
    event.preventDefault();
    const sortType = this.id;
    const baseUrl = 'https://api.themoviedb.org/3/discover/movie?sort_by=';
    const apiKey = '&api_key=3ba758977c84617b0c5934c60b2a67b4&page=';
    const url = `${baseUrl}${sortOptions[sortType]}${apiKey}`;
    handleLinkClick(url, this);
    prev_url = baseUrl + sortOptions[sortType];
}

document.getElementById('revenue').addEventListener('click', handleSortClick);
document.getElementById('popularity').addEventListener('click', handleSortClick);
document.getElementById('rating').addEventListener('click', handleSortClick);

document.getElementById('popularity').classList.add('active');

// JavaScript for genre part
document.addEventListener("DOMContentLoaded", () => {
    let filterButton = document.getElementById("filt");
    let dropdownContent = document.getElementById("dropdown-content2");
    let dropdown = document.getElementById("did");

    filterButton.addEventListener("click", () => {
        if (dropdownContent.style.display === "flex") {
            dropdownContent.style.display = "none";
            dropdown.style.backgroundColor = "";
            dropdown.style.marginBottom = "-15px";

        } else {
            dropdownContent.style.display = "flex";
            dropdown.style.backgroundColor = "#960606";
            dropdown.style.marginBottom = "260px";

        }
    });
});

// Function to handle genre link clicks

document.getElementById('111').style.backgroundColor = 'rgb(129, 125, 130)';
const handleGenreLinkClick2 = (url, element) => {
    fetchAllMovies(url)
        .then(movies => { showMovies(movies); })
        .catch(error => console.error('Error fetching movies:', error));

    // Update active link background color
    document.querySelectorAll('#dropdown-content2 a').forEach((link) => {
        link.style.backgroundColor = '';  // Reset background color
    });
    element.style.backgroundColor = 'rgb(129, 125, 130)';  // Set background color for the selected genre
};



// Event listeners for genre links in the second dropdown

document.querySelectorAll('#dropdown-content2 a').forEach((link) => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        let genreId = this.id;

        let genreUrl;
        if (genreId === '111') {
            genreUrl = `${prev_url}&api_key=3ba758977c84617b0c5934c60b2a67b4&page=`;
        } else {
            genreUrl = `${prev_url}&with_genres=${genreId}&api_key=3ba758977c84617b0c5934c60b2a67b4&page=`;
        }
        handleGenreLinkClick2(genreUrl, this);
    });
});
