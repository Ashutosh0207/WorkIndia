const mongoose = require('mongoose');
const { Schema } = mongoose;

const diningPlaceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone_no: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  operational_hours: {
    open_time: {
      type: String,
      required: true,
    },
    close_time: {
      type: String,
      required: true,
    },
  },
  booked_slots: [{
    start_time: {
      type: Date,
      required: true
    },
    end_time: {
      type: Date,
      required: true
    }
  }],
});

const DiningPlace = mongoose.model('DiningPlace', diningPlaceSchema);

module.exports = DiningPlace;
