const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
        INSERT INTO users(name,email,password)
        VALUES($1,$2,$3)
        `;

        const values = [name, email, hashedPassword];

        await pool.query(query, values);

        return res.status(201).json({
            success: true,
            message: "User registered successfully"
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


//for login 
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;
        const userResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
);
        if (userResult.rows.length === 0) {
        return res.status(401).json({
        success: false,
        message: "Invalid email or password"
    });
}
        const user=userResult.rows[0];
        //to compare passwords
        const isPasswordValid = await bcrypt.compare(
        password,
        user.password
);
        if (!isPasswordValid) {
        return res.status(401).json({
        success: false,
        message: "Invalid email or password"
    });
}
        console.log(userResult.rows);

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const token=jwt.sign({
            id:user.id,
            email:user.email,
            role:user.role
        },
    process.env.JWT_SECRET,{
        expiresIn: "1h"
    });
        console.log("JWT Secret:", process.env.JWT_SECRET);
console.log("Generated Token:", token);

        return res.json({
            success: true,
            message: "Login successful",
            token:token
        });

    }
    catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};
const getProfile = async (req, res) => {

    return res.status(200).json({
        success: true,
        user: req.user
    });

};

//to export all
module.exports = {
    registerUser,loginUser,getProfile
};