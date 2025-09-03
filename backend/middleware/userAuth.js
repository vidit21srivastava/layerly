import jwt from 'jsonwebtoken'

const userAuth = async (req, res, callback) => {

    try {
        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({
                sucess: false,
                message: "Not Authorized. Check the credentials."
            })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        req.body.userID = token_decode.id;

        callback()

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

export default userAuth;