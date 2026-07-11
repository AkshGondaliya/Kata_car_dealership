const express = require("express");

const router = express.Router();

const { addVehicle, getAllVehicles, updateVehicle,deleteVehicle,searchVehicles,purchaseVehicle,restockVehicle} = require("../controllers/vehicleController");
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
router.post(
    "/:id/purchase",authenticate,purchaseVehicle
);
router.post("/:id/restock",authenticate, isAdmin, restockVehicle);

module.exports = router;