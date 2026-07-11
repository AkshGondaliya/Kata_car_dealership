const express = require("express");

const router = express.Router();

const { addVehicle, getAllVehicles, updateVehicle} = require("../controllers/vehicleController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

router.post("/",authenticate, isAdmin, addVehicle);
router.get("/", getAllVehicles);
router.put(
    "/:id",
    authenticate,
    isAdmin,
    updateVehicle
);

module.exports = router;