const express = require("express");
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  getItemById,
} = require("../controllers/itemController");
const authenticate = require("../middlewares/authentication");
const authorize = require("../middlewares/authorization");
const router = express.Router();

router.get("/", getItems);
router.post("/add", authenticate, authorize(["admin"]), createItem);
router.put("/:id", authenticate, updateItem);
router.delete("/:id", authenticate, deleteItem);
router.get('/items/:id', getItemById);


module.exports = router;
