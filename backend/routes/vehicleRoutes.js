const express = require("express");

const router = express.Router();

const { addVehicle, getAllVehicles, updateVehicle,deleteVehicle,searchVehicles} = require("../controllers/vehicleController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

router.post("/",authenticate, isAdmin, addVehicle);
router.get("/", getAllVehicles);
router.put(
    "/:id",
    authenticate,
    isAdmin,
    updateVehicle
);
router.delete("/:id", authenticate, isAdmin, deleteVehicle);
router.get(
    "/search",
    authenticate,
    searchVehicles
);

module.exports = router;