const express = require("express");

const router = express.Router();

const verifyToken =
require("../middleware/authMiddleware");
const checkManager=require("../middleware/roleMiddleware");

const {
    getPendingRequests,
    getEmployeeLeaveHistory
} = require("../controllers/managerController");

router.get(
    "/pending",
    verifyToken,
    checkManager,
    getPendingRequests
);

router.get("/employee/:id/leaves",
    verifyToken,
    checkManager,
    getEmployeeLeaveHistory
);

module.exports = router;