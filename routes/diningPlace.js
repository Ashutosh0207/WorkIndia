const express = require("express");
const DiningPlace = require("../models/DiningPlace");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Add a new dining place (restricted to admins)
router.post("/create", async (req, res) => {
  const { name, address, phone_no, website, operational_hours, booked_slots } =
    req.body;

  try {
    const diningPlace = new DiningPlace({
      name,
      address,
      phone_no,
      website,
      operational_hours,
      booked_slots,
    });
    await diningPlace.save();
    res.status(201).json({
      message: "Dining place added successfully",
      place_id: diningPlace._id,
      status_code: 200,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating dining place",
      status_code: 400,
      error: error.message,
    });
  }
});

// Search dining places by name keywords
router.get("/", async (req, res) => {
  const { name } = req.query;

  try {
    const regex = new RegExp(name, "i"); // 'i' makes it case-insensitive
    const diningPlaces = await DiningPlace.find({ name: { $regex: regex } });
    res.status(200).json({
      results: diningPlaces.map((place) => ({
        place_id: place._id,
        name: place.name,
        address: place.address,
        phone_no: place.phone_no,
        website: place.website,
        operational_hours: place.operational_hours,
        booked_slots: place.booked_slots,
      })),
    });
  } catch (error) {
    res.status(400).json({
      message: "Error searching for dining places",
      status_code: 400,
      error: error.message,
    });
  }
});

// Book
router.post("/book", async (req, res) => {
  const { authorization } = req.headers;
  const { place_id, start_time, end_time } = req.body;

  try {
    const user = await User.findById(authorization);

    console.log(user);

    if (!user) {
      return res
        .status(401)
        .json({ status: "Invalid token", status_code: 401 });
    }

    const diningPlace = await DiningPlace.findById(place_id);
    if (!diningPlace) {
      return res.status(404).json({
        message: "Dining place not found",
        status_code: 404,
      });
    }

    const overlappingBooking = diningPlace.booked_slots.some(
      (slot) =>
        new Date(start_time) < new Date(slot.end_time) &&
        new Date(end_time) > new Date(slot.start_time)
    );

    if (overlappingBooking) {
      return res.status(400).json({
        message:
          "Slot is not available at this moment, please try some other place",
        status_code: 400,
      });
    }

    diningPlace.booked_slots.push({ user_id: user._id, start_time, end_time });
    await diningPlace.save();

    res.status(201).json({
      status: "Slot booked successfully",
      status_code: 200,
      booking_id:
        diningPlace.booked_slots[diningPlace.booked_slots.length - 1]._id,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error booking slot",
      status_code: 400,
      error: error.message,
    });
  }
});

module.exports = router;
