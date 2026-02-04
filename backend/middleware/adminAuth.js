import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).json({
                sucess: false,
                message: "Not Authorized. Check the credentials."
            })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        if (token_decode.email !== process.env.ADMIN_EMAIL || token_decode.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Check the credentials."
            })
        }

        next()

    } catch (error) {
        console.log(error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token."
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export default adminAuth;