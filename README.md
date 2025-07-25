# Movie Mania

Movie Mania is a full-stack web application that allows users to discover, search, and manage a personal watchlist of movies. The project is built using the MERN stack (MongoDB, Express, Node.js) with Handlebars for server-side rendering.

---

## Features

- **User Authentication:** Secure registration and login with hashed passwords.
- **Personal Watchlist:** Add, view, and remove movies from your own watchlist.
- **Movie Discovery:** Browse trending and popular movies (integrate with TMDb API).
- **Server-Side Rendering:** Dynamic pages using Handlebars.
- **Session Management:** User sessions with express-session.
- **Responsive UI:** Clean and simple interface.

---

## Project Structure

```
AjayMoviemania/
│
├── backend/
│   ├── src/
│   │   ├── db/
│   │   ├── models/
│   │   └── app.js
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── public/
│   │   ├── css/
│   │   └── js/
│   ├── templates/
│   │   ├── partials/
│   │   └── views/
│   └── ...
│
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/AjayMoviemania.git
   cd AjayMoviemania
   ```

2. **Install backend dependencies:**
   ```sh
   cd backend
   npm install
   ```

3. **(Optional) Install frontend dependencies:**  
   *(If you add a frontend framework in the future)*

---

## Running the Application

1. **Start MongoDB**  
   Make sure MongoDB is running locally.

2. **Start the backend server:**
   ```sh
   npm run dev
   ```
   The server will run at [http://localhost:3000](http://localhost:3000).

3. **Access the app:**  
   Open your browser and go to [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env` file in the `backend` directory for sensitive configuration (optional):

```
MONGODB_URI=mongodb://localhost:27017/moviemaniaregistration
SESSION_SECRET=your_secret_key
```

---

## Future Scope

- JWT authentication
- Social login (Google, Facebook)
- Password reset and email verification
- Movie recommendations
- Responsive and mobile-friendly UI
- Admin dashboard

---

## License

This project is licensed under the ISC License.

---

## Author

Ajay

---

## Acknowledgements

- [The Movie Database (TMDb) API](https://www.themoviedb.org/documentation/api)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Handlebars.js](https://handlebarsjs.com/)
