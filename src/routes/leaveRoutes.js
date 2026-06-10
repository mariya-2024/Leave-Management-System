const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    applyLeave
} = require("../controllers/leaveController");

router.post(
    "/apply",
    verifyToken,
    applyLeave
);

module.exports = router;