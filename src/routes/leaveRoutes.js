const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    applyLeave,getLeaveHistory
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
module.exports = router;