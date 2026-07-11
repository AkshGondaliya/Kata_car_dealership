const express = require("express");

const router = express.Router();

const { addVehicle } = require("../controllers/vehicleController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

router.post("/",authenticate, isAdmin, addVehicle);

module.exports = router;