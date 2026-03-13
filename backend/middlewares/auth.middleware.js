import User from '../models/user.model.js';
import ErrorResponse from '../uttils/ErrorClass.js';
import jwt from 'jsonwebtoken';



export const verifyUser = async (req, res, next) => {
    try {
        let accessToken = req.cookies.token;

        if(!accessToken) {
            throw new ErrorResponse('Access token not found' , 404);
        }

        let decodedToken = jwt.verify(accessToken , process.env.JWT_ACCESS_SECRET);


        let user = await User.findById(decodedToken.id);

        if(!user) {
            throw new ErrorResponse('User not found' , 404);
        }

        req.user = user;
        next();

    } catch (error) {
        next(new ErrorResponse(error?.message || 'Something went wrong in verifyUser', 500));
    }
};
