import jwt from 'jsonwebtoken';


const adminAuth = async (req, res, callback) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).json({
                sucess: false,
                message: "Not Authorized. Check the credentials."
            })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(401).json({
                sucess: false,
                message: "Not Authorized. Check the credentials."
            })
        }

        callback()

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export default adminAuth;