const express = require("express");

const router = express.Router();

const { addVehicle, getAllVehicles} = require("../controllers/vehicleController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

router.post("/",authenticate, isAdmin, addVehicle);
router.get("/", getAllVehicles);

module.exports = router;