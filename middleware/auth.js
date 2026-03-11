const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // 1. Request ke Header se token nikalna (Authorization: Bearer <token>)
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // 2. Agar token nahi milta
    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Access Denied: Login karke Token bhejiye!"
        });
    }

    try {
        // 3. Token ko verify karna (Secret Key wahi honi chahiye jo Login controller mein hai)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nighwantech_secret_key_2026');

        // 4. User ki info request object mein save kar dena
        req.user = decoded;

        // 5. Agle function (Controller) ko chalne dena
        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            error: "Invalid ya Expired Token! Fir se login karein."
        });
    }
};

module.exports = auth;