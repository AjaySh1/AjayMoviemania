require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
require("./db/conn");
const Register = require("./models/registers");
const crypto = require("crypto");
const session = require("express-session");
const bcrypt = require("bcryptjs"); 

const port = process.env.PORT || 3000;

// Update these paths to point to frontend
const static_path = path.join(__dirname, "../../frontend/public");
const template_path = path.join(__dirname, "../../frontend/templates/views");
const partials_path = path.join(__dirname, "../../frontend/templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

// Use SESSION_SECRET from .env or fallback to random
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(64).toString("hex");
app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
    })
);

// Helper function to hash passwords
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

// Helper function to save user to DB with hashed password
async function saveUserToDB({ username, email, password }) {
    const hashedPassword = await hashPassword(password);
    const newUser = new Register({ username, email, password: hashedPassword });
    await newUser.save();
}

app.get("/", (req, res) => {
    res.render("index", { username: req.session.username });
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    const { username, email, password, confirm_password } = req.body;

    try {
        if (password !== confirm_password) {
            return res.status(400).send("Passwords do not match");
        }

        await saveUserToDB({ username, email, password });

        req.session.username = username;
        res.redirect("/");
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("An error occurred during registration. Please try again.");
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Register.findOne({ email });

        if (!user) {
            console.log("User not found");
            return res.render("login", { error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Stored Hashed Password: ${user.password}`);
        console.log(`Entered Password: ${password}`);
        console.log(`Password Match: ${isMatch}`);

        if (isMatch) {
            req.session.username = user.username;
            return res.redirect("/");
        } else {
            return res.render("login", { error: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Logout failed");
        }
        res.redirect("/");
    });
});

app.post("/add-to-watchlist", async (req, res) => {
    const username = req.session.username;
    const { movie } = req.body;

    if (!username) {
        return res.status(401).send("User not logged in");
    }

    try {
        const user = await Register.findOne({ username });

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.watchlist = user.watchlist || [];
        const alreadyExists = user.watchlist.find((item) => item.id === movie.id);

        if (alreadyExists) {
            return res.status(400).send("Movie is already in the watchlist");
        }

        user.watchlist.push(movie);
        await user.save();

        res.status(200).send("Movie added to watchlist successfully");
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        res.status(500).send("An error occurred while adding the movie to the watchlist");
    }
});

app.get("/watchlist", async (req, res) => {
    const username = req.session.username;

    if (!username) {
        return res.status(401).send("User not logged in");
    }

    try {
        const user = await Register.findOne({ username });

        if (!user || !user.watchlist) {
            return res.json({ watchlist: [] });
        }

        res.json({ watchlist: user.watchlist });
    } catch (error) {
        console.error("Error fetching watchlist:", error);
        res.status(500).send("An error occurred while fetching the watchlist");
    }
});

app.delete('/remove-from-watchlist', async (req, res) => {
    const username = req.session.username;

    if (!username) {
        return res.status(401).send("User not logged in");
    }

    try {
        const movieId = req.body.id;
        const user = await Register.findOne({ username });

        if (!user || !user.watchlist) {
            return res.status(404).send("User's watchlist not found");
        }

        user.watchlist = user.watchlist.filter((movie) => movie.id !== movieId);
        await user.save();

        res.status(200).send('Movie removed from watchlist successfully.');
    } catch (error) {
        console.error('Error removing movie:', error);
        res.status(500).send('Failed to remove movie.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});