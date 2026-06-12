const cors=require("cors");
const authRoutes = require("./src/routes/authRoutes");
const leaveRoutes=require("./src/routes/leaveRoutes");
const bcrypt=require("bcrypt");
const express = require("express");
const pool=require("./src/config/db");//for db pool 
const managerRoutes= require("./src/routes/managerRoutes");

const app = express();
app.use(express.json());//to understand json 
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/leaves",leaveRoutes);
app.use("/api/manager",managerRoutes);
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Server Running Successfully");
});

app.get("/test", (req, res) => {
    res.send("Test Route Working");
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});