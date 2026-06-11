const pool = require("../config/db");

const applyLeave = async (req, res) => {

    try {

        // Get logged-in user's ID from JWT
        const userId = req.user.id;

        // Get data sent from frontend
        const { leave_type, start_date, end_date, reason } = req.body;

        // Check if all fields are provided
        if (!leave_type || !start_date || !end_date || !reason) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check date validation
        if (new Date(end_date) < new Date(start_date)) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date"
            });
        }

        // SQL Query
        const query = `
            INSERT INTO leave_requests
            (user_id, leave_type, start_date, end_date, reason)
            VALUES ($1, $2, $3, $4, $5)
        `;

        // Values for placeholders
        const values = [
            userId,
            leave_type,
            start_date,
            end_date,
            reason
        ];

        // Execute query
        await pool.query(query, values);

        // Success response
        return res.status(201).json({
            success: true,
            message: "Leave applied successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};
const getLeaveHistory = async (req, res) => {

    try {

        const userId = req.user.id;

        const query = `
            SELECT *
            FROM leave_requests
            WHERE user_id = $1
            ORDER BY created_at DESC
        `;

        const result = await pool.query(query, [userId]);

        return res.status(200).json({
            success: true,
            leaves: result.rows
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const getDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        // Total available leaves
        const totalLeaves = 20;

        // Count approved leaves
        const approvedResult = await pool.query(
            `SELECT COUNT(*) 
             FROM leave_requests
             WHERE user_id = $1
             AND status = 'Approved'`,
            [userId]
        );

        // Count pending leaves
        const pendingResult = await pool.query(
            `SELECT COUNT(*)
             FROM leave_requests
             WHERE user_id = $1
             AND status = 'Pending'`,
            [userId]
        );

        const leavesTaken = parseInt(
            approvedResult.rows[0].count
        );

        const pendingLeaves = parseInt(
            pendingResult.rows[0].count
        );

        const remainingLeaves =
            totalLeaves - leavesTaken;

        return res.status(200).json({
            success: true,
            dashboard: {
                totalLeaves,
                leavesTaken,
                pendingLeaves,
                remainingLeaves
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

module.exports = {
    applyLeave,getLeaveHistory,getDashboard
};