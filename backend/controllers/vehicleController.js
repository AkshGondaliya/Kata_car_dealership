const Vehicle = require("../models/Vehicle");

const addVehicle = async (req, res) => {
  try {
    const { make, model, category, price, quantity } = req.body;

    // Basic Validation
    if (!make || !model || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check for duplicate vehicle
    const existingVehicle = await Vehicle.findOne({
      make,
      model,
    });

    if (existingVehicle) {
      return res.status(409).json({
        success: false,
        message: "Vehicle already exists",
      });
    }

    // Create Vehicle
    const vehicle = await Vehicle.create({
      make,
      model,
      category,
      price,
      quantity,
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

module.exports = {
  addVehicle,
};