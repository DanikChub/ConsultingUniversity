const jwt = require("jsonwebtoken");

const generateJwt = (id, login, role, must_change_password = false) => {
    return jwt.sign(
        { id, login, role, must_change_password },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
    );
};

module.exports = {
    generateJwt,
};