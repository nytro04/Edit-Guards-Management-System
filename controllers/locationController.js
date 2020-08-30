const Location = require("../models/locationModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

/**
 * Location Routes Handler Functions or controllers
 * handles routes to the various Location endpoints
 *
 * All communication with the DB returns a promise
 * @param {object} req
 * @param {object} res
 * @param {function} next calls the next middleware in the middleware stack
 */

// Get all locations
exports.getAllLocations = catchAsync(async (req, res, next) => {
  const locations = await Location.find();

  res.status(200).json({
    status: "success",
    data: {
      locations,
    },
  });
});

exports.createLocation = catchAsync(async (req, res, next) => {
  const { name, client, zone, area } = req.body;

  //Check for required fields
  if (!name) return next(new AppError("Please provide a location name"));
  if (!area) return next(new AppError("Please provide a location area"));
  if (!client) return next(new AppError("Please provide a client name"));
  if (!zone) return next(new AppError("Please provide a zone name"));

  const location = { name, area, client, zone };

  const newLocation = await Location.create(location);

  res.status(201).json({
    status: "success",
    data: {
      location: newLocation,
    },
  });
});