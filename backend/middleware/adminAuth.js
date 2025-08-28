import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.json({
                success: false,
                message: 'Not Authorized. Login Again'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.json({
                success: false,
                message: 'Admin access required'
            });
        }

        req.adminId = decoded.id;
        next();

    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

export default adminAuth;
