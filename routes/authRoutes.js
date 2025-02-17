// const express = require('express');
// const { register, login, logout, getAllUsers } = require('../controllers/authController');
// const authorize = require('../middlewares/authorization');
// const router = express.Router();

// router.get('/users', authorize(['admin']), getAllUsers);
// router.post('/register', register);
// router.post('/login', login);
// router.post('/logout', logout);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

const authorize = require("../middlewares/authorization");

// Existing routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/users", authorize(["admin"]), getAllUsers);

// New admin routes
router.post("/users", authorize(["admin"]), addUser);
router.put("/users/:id", authorize(["admin"]), updateUser);
router.delete("/users/:id", authorize(["admin"]), deleteUser);

module.exports = router;
