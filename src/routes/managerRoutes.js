const express = require("express");

const router = express.Router();

const verifyToken =
require("../middleware/authMiddleware");
const checkManager=require("../middleware/roleMiddleware");

const {
    getPendingRequests,
    getEmployeeLeaveHistory,
    approveLeave,
    rejectLeave,
    getManagerDashboard,
    getCalendarLeaves
} = require("../controllers/managerController");

router.get(
    "/pending",
    verifyToken,
    checkManager,
    getPendingRequests
);
router.get(
    "/dashboard",
    verifyToken,
    getManagerDashboard
);
router.get(
    "/calendar",
    verifyToken,
    checkManager,
    getCalendarLeaves

);
router.get("/employee/:id/leaves",
    verifyToken,
    checkManager,
    getEmployeeLeaveHistory
);

router.put("/approve/:id",
    verifyToken,
    checkManager,
    approveLeave
)

router.put(
    "/reject/:id",
    verifyToken,
    checkManager,
    rejectLeave
);

module.exports = router;