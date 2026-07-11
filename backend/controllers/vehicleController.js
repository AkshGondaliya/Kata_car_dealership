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


// Existing addVehicle()

const getAllVehicles = async (req, res) => {
  try {

    const vehicles = await Vehicle.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const updateVehicle = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            make,
            model,
            category,
            price,
            quantity
        } = req.body;

        const vehicle = await Vehicle.findById(id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        vehicle.make = make;
        vehicle.model = model;
        vehicle.category = category;
        vehicle.price = price;
        vehicle.quantity = quantity;

        await vehicle.save();

        return res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            vehicle
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

module.exports = {
  addVehicle,
  getAllVehicles,
  updateVehicle
};