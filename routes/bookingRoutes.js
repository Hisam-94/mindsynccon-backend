const express = require("express");
const {
  createBooking,
  getBookingsByUser,
  updateBooking,
  cancelBooking,
} = require("../controllers/bookingController");
const authenticate = require("../middlewares/authentication");
const router = express.Router();

router.post("/", authenticate, createBooking);
router.get("/:userId", authenticate, getBookingsByUser);
router.put("/:id", authenticate, updateBooking);
router.delete("/:id", authenticate, cancelBooking);

module.exports = router;
