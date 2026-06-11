const checkManager = (req, res, next) => {

    if (req.user.role !== "manager") {

        return res.status(403).json({
            success: false,
            message: "Access denied. Manager only."
        });

    }

    next();

};

module.exports = checkManager;