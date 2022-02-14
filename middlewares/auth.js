const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
    try {
		const token = req.headers.authorization.split(" ")[1].slice(0, -1);	//	to remove the " in the last character in the string
		const decoded = jwt.verify(token, process.env.SECRET);
        req.body.actualEmail = decoded.email;
		next();
    } catch (error) {
        res.status(401).json({ message: "Auth failed!" });
    }
};