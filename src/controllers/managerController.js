const pool = require("../config/db");

const getPendingRequests = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT

            leave_requests.id,

            users.name,

            users.email,

            leave_requests.leave_type,

            leave_requests.start_date,

            leave_requests.end_date,

            leave_requests.reason,

            leave_requests.status

            FROM leave_requests

            JOIN users

            ON leave_requests.user_id = users.id

            WHERE leave_requests.status='Pending'

            ORDER BY leave_requests.created_at DESC
        `);

        return res.status(200).json({
            success: true,
            requests: result.rows
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const getEmployeeLeaveHistory = async (req, res) => {

    try {

        const employeeId = req.params.id;

        const query = `
            SELECT *
            FROM leave_requests
            WHERE user_id = $1
            ORDER BY created_at DESC
        `;

        const result = await pool.query(
            query,
            [employeeId]
        );

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

module.exports = {
    getPendingRequests,
    getEmployeeLeaveHistory
};