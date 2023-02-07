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

const { body, validationResult } = require("express-validator");
const validateUser = [
  body("email").isEmail(),
  body("firstname").isLength({ max: 255 }),
  body("lastname").isLength({ max: 255 }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

const movieHandlers = require("./movieHandlers");
const { validateMovie } = require("./validators.js");
const { hashPassword, verifyPassword, verifyToken, verifyId} = require("./auth.js");
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
app.put(
  "/api/movies/:id",
  verifyToken,
  validateMovie,
  movieHandlers.updateMovie
);
app.delete("/api/movies/:id", verifyToken, movieHandlers.deleteMovie);

app.post(
  "/api/users",
  verifyToken,
  validateUser,
  hashPassword,
  userHandlers.postUser
);
app.put(
  "/api/users/:id",
  verifyId
  verifyToken,
  validateUser,
  hashPassword,
  userHandlers.updateUser
);
app.delete("/api/users/:id", verifyId, verifyToken, userHandlers.deleteUser);

app.post(
  "/api/users",
  body("firstname").isLength({ max: 255 }),
  body("lastname").isLength({ max: 255 }),
  body("email").isEmail()
);
app.put(
  "/api/users/:id",
  body("firstname").isLength({ max: 255 }),
  body("lastname").isLength({ max: 255 }),
  body("email").isEmail()
);

app.post(
  "/api/movies",
  body("title").isLength({ max: 255 }),
  body("director").isLength({ max: 255 }),
  body("year").isLength({ max: 255 })
);

app.put(
  "/api/movies/:id",
  body("title").isLength({ max: 255 }),
  body("director").isLength({ max: 255 }),
  body("year").isLength({ max: 255 })
);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
