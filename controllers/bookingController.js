// const Booking = require('../models/Booking');

// // const createBooking = async (req, res) => {
// //   try {
// //     const newBooking = new Booking(req.body);
// //     await newBooking.save();
// //     res.status(201).json(newBooking);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// const createBooking = async (req, res) => {
//   try {
//     const { userId, itemId, date, totalPrice } = req.body;

//     const booking = new Booking({
//       user: userId,
//       item: itemId,
//       date,
//       totalPrice,
//     });

//     await booking.save();
//     res.status(201).json({ message: 'Booking confirmed', booking });
//   } catch (err) {
//     res.status(500).json({ message: 'Booking failed', error: err.message });
//   }
// };

// const getBookingsByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     console.log("userId", userId);
//     const bookings = await Booking.find({ userId }).populate('itemId');
//     res.status(200).json(bookings);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const updateBooking = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
//     res.status(200).json(updatedBooking);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const deleteBooking = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Booking.findByIdAndDelete(id);
//     res.status(200).json({ message: "Booking deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const cancelBooking = async (req, res) => {
//   try {
//     await Booking.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: 'Booking canceled successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to cancel booking', error: err.message });
//   }
// };

// module.exports = { createBooking, getBookingsByUser, updateBooking, deleteBooking, cancelBooking };


const Booking = require('../models/Booking');
const Item = require('../models/Item');

const createBooking = async (req, res) => {
  try {
    const { userId, itemId, startDate, endDate, totalPrice } = req.body;
    console.log("req.body inside createBooking", req.body);

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" });
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    // Check for existing bookings on the same item within the specified range
    const overlappingBooking = await Booking.findOne({
      itemId,
      $or: [
        { startDate: { $lt: parsedEndDate }, endDate: { $gte: parsedEndDate } },
        { startDate: { $lte: parsedStartDate }, endDate: { $gt: parsedStartDate } },
        { startDate: { $gte: parsedStartDate }, endDate: { $lte: parsedEndDate } },
      ],
    });
   
    if (overlappingBooking) {
      return res.status(400).json({ message: "The item is already booked for the selected dates" });
    }

    const booking = new Booking({
      userId,
      itemId,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      totalPrice,
    });

    await booking.save();
    await Item.findByIdAndUpdate(itemId, { availability: false  });
    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (err) {
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
};


const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId })
      .populate('itemId')
      .sort({ startDate: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve bookings", error: err.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { ...req.body, startDate: parsedStartDate, endDate: parsedEndDate },
      { new: true }
    );

    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(500).json({ message: "Failed to update booking", error: err.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete booking", error: err.message });
  }
};


const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const {itemId} = req.body

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // if (booking.status === 'canceled') {
    //   return res.status(400).json({ message: "Booking is already canceled" });
    // }

    // booking.status = 'canceled';
    // await booking.save();
    await Item.findByIdAndUpdate(itemId, { availability: true  });

    res.status(200).json({ message: "Booking canceled successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel booking", error: err.message });
  }
};


module.exports = { createBooking, getBookingsByUser, updateBooking, deleteBooking, cancelBooking };
