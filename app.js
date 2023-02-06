require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5002;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);


const isItDwight = (req, res) => {
  if (
    req.body.email === "dwight@theoffice.com" &&
    req.body.password === "123456"
  ) {
    res.send("Credentials are valid");
  } else {
    res.sendStatus(401);
  }
};
app.post("/api/login", isItDwight);

const movieHandlers = require("./movieHandlers");
const { validateMovie } = require("./validators.js");
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");
const userHandlers = require("./userHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.post("/api/movies", verifyToken, validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", verifyToken, movieHandlers.updateMovie);
app.delete("/api/movies/:id", verifyToken, movieHandlers.deleteMovie);


app.post("/api/users", verifyToken, hashPassword, userHandlers.postUser);
app.put("/api/users/:id", verifyToken, hashPassword, userHandlers.updateUser);
app.delete("/api/users/:id", verifyToken, userHandlers.deleteUser);





app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
