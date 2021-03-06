const mongoose = require("mongoose");
const validator = require("validator");

const clientSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Client name is required"],
    trim: true,
  },
  contactPerson: {
    type: String,
    required: [true, "Contact person required"],
    unique: true, // helps to avoid duplication of field name
    maxlength: [60, "A guard name must be less than 60 characters"],
    minlength: [5, "A guard name must be more than 5 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: Number,
    required: [true, "Phone number required"],
  },
  rate: {
    type: Number,
    required: [true, "Phone number required"],
  },
  address: {
    type: String,
    required: [true, "Client address is required"],
    trim: true,
  },
  startDate: {
    type: Date,
  },

  // locations: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: "Location",
  //   },
  // ],
});

// Virtual Populate
clientSchema.virtual("locations", {
  ref: "Location",
  foreignField: "client", // how client model is called in the Location model
  localField: "_id", // how client is referred to in client model
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
