const pool = require("../config/db");
const sendEmail = require("../utils/sendEmail");
// ======================================
// Apply Leave
// ======================================

const applyLeave = async (req, res) => {

    try {

        // Logged-in user
        const userId = req.user.id;

        const userResult = await pool.query(
            `
            SELECT name,email
            FROM users
            WHERE id = $1
            `,
            [userId]
        );

        const employeeName =
            userResult.rows[0].name;

        const employeeEmail =
            userResult.rows[0].email;
        // Request body
        const {
            leave_type,
            start_date,
            end_date,
            reason
        } = req.body;

        // Validate fields
        if (
            !leave_type ||
            !start_date ||
            !end_date ||
            !reason
        ) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }

        // Validate dates
        if (
            new Date(end_date) <
            new Date(start_date)
        ) {

            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date"
            });

        }

        // ----------------------------------
        // Calculate leave days
        // ----------------------------------

        const start = new Date(start_date);

        const end = new Date(end_date);

        const days =
            Math.floor(
                (end - start) /
                (1000 * 60 * 60 * 24)
            ) + 1;

        // ----------------------------------
        // Check already approved leave days
        // ----------------------------------

        const approvedResult =
            await pool.query(

                `
                SELECT
                COALESCE(SUM(days),0)
                AS total

                FROM leave_requests

                WHERE user_id = $1

                AND status = 'Approved'
                `,

                [userId]

            );

        const usedDays =
            parseInt(
                approvedResult.rows[0].total
            );

        const TOTAL_LEAVES = 20;

        const remaining =
            TOTAL_LEAVES - usedDays;

        // Prevent exceeding leave balance

        if (days > remaining) {

            return res.status(400).json({

                success: false,

                message:
                    `Only ${remaining} leave days remaining`

            });

        }

        // ----------------------------------
        // Insert leave request
        // ----------------------------------

        const query = `

            INSERT INTO leave_requests

            (
                user_id,
                leave_type,
                start_date,
                end_date,
                reason,
                days
            )

            VALUES

            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
            )

        `;

        const values = [

            userId,

            leave_type,

            start_date,

            end_date,

            reason,

            days

        ];

        await pool.query(query, values);

        try {

    await sendEmail(

        employeeEmail,

        "Leave Request Submitted",

        `Hello ${employeeName},

Your leave request has been submitted successfully.

Leave Type: ${leave_type}

Start Date: ${start_date}

End Date: ${end_date}

Status: Pending

Regards,
LeaveEase`

    );

}
catch(error){

    console.log(
        "Employee email failed:",
        error.message
    );

}

try {

    await sendEmail(

        "manager@gmail.com",

        "New Leave Request",

        `A new leave request has been submitted.

Employee:
${employeeName}

Leave Type:
${leave_type}

Start Date:
${start_date}

End Date:
${end_date}

Please review the request.

Regards,
LeaveEase`

    );

}
catch(error){

    console.log(
        "Manager email failed:",
        error.message
    );

}

        // Success

        return res.status(201).json({

            success: true,

            message:
                "Leave applied successfully"

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// ======================================
// Leave History
// ======================================

const getLeaveHistory = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(

            `
            SELECT *

            FROM leave_requests

            WHERE user_id = $1

            ORDER BY created_at DESC
            `,

            [userId]

        );

        return res.status(200).json({

            success: true,

            leaves: result.rows

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};

const deleteLeave = async (req, res) => {

    try {

        const leaveId = req.params.id;

        const userId = req.user.id;

        const result = await pool.query(

            `
            DELETE FROM leave_requests

            WHERE id = $1

            AND user_id = $2

            AND status = 'Pending'

            `,
            [leaveId, userId]

        );

        return res.status(200).json({

            success: true,

            message: "Leave deleted successfully"

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

// ======================================
// Employee Dashboard
// ======================================

const getDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        const TOTAL_LEAVES = 20;

        // Approved leave days

        const approvedResult =
            await pool.query(

                `
                SELECT
                COALESCE(SUM(days),0)
                AS total

                FROM leave_requests

                WHERE user_id = $1

                AND status = 'Approved'
                `,

                [userId]

            );

        // Pending requests

        const pendingResult =
            await pool.query(

                `
                SELECT COUNT(*)

                FROM leave_requests

                WHERE user_id = $1

                AND status = 'Pending'
                `,

                [userId]

            );

        const leavesTaken =
            parseInt(
                approvedResult.rows[0].total
            );

        const pendingLeaves =
            parseInt(
                pendingResult.rows[0].count
            );

        const remainingLeaves =
            TOTAL_LEAVES - leavesTaken;

        return res.status(200).json({

            success: true,

            dashboard: {

                totalLeaves:
                    TOTAL_LEAVES,

                leavesTaken,

                pendingLeaves,

                remainingLeaves

            }

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};

const updateLeave = async (req, res) => {

    try {

        const leaveId = req.params.id;

        const userId = req.user.id;

        const {
            start_date,
            end_date,
            reason
        } = req.body;

        const days =
            Math.floor(

                (
                    new Date(end_date) -
                    new Date(start_date)
                )

                /

                (1000 * 60 * 60 * 24)

            ) + 1;

        await pool.query(

            `
            UPDATE leave_requests

            SET

            start_date = $1,

            end_date = $2,

            reason = $3,

            days = $4

            WHERE

            id = $5

            AND user_id = $6

            AND status = 'Pending'
            `,

            [
                start_date,
                end_date,
                reason,
                days,
                leaveId,
                userId
            ]

        );

        return res.status(200).json({

            success: true,

            message:
                "Leave updated successfully"

        });

    }

    catch(error){

        console.log(error);

        return res.status(500).json({

            success:false,

            message:
                "Internal Server Error"

        });

    }

};


module.exports = {

    applyLeave,
    updateLeave,
    getLeaveHistory,

    getDashboard,
    deleteLeave

};