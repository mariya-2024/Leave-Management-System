const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    applyLeave,getLeaveHistory,getDashboard,deleteLeave,updateLeave
} = require("../controllers/leaveController");

router.post(
    "/apply",
    verifyToken,
    applyLeave
);
router.get(
    "/history",
    verifyToken,getLeaveHistory
);
router.get(
    "/dashboard",
    verifyToken,
    getDashboard
);
router.delete(
    "/:id",
    verifyToken,
    deleteLeave
);
router.put(
    "/:id",
    verifyToken,
    updateLeave
);
module.exports = router;