import User from '../models/user.model.js';
import ErrorResponse from '../uttils/ErrorClass.js';
import ApiResponse from '../uttils/ApiResponse.js';


export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new ErrorResponse('Please fill all the fields' , 400);
        }
        console.log(name, email, password);
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new ErrorResponse('User already exists' , 400);
        }

        const user = await User.create({ name, email, password });

        if(!user) {
            throw new ErrorResponse('User could not be created' , 500);
        }

        return res.status(201).json(new ApiResponse('User created successfully', 201, user));

    } catch (error) {
        next(new ErrorResponse(error.message, 500));
    }
}

export const login = async (req, res, next) => {
    try {
        let {email , password} = req.body;

        if(!email || !password) {
            throw new ErrorResponse('Please fill all the fields' , 400);
        }

        const user = await User.findOne({email}).select('+password');

        if(!user) {
            throw new ErrorResponse('Invalid credentials' , 401);
        }

        const isMatch = await user.matchPassword(password);
        if(!isMatch) {
            throw new ErrorResponse('Invalid credentials' , 401);
        }

        return res.status(200)
            .cookie('token' , user.generateAccessToken() , {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            })
            .cookie('refreshToken' , user.generateRefreshToken() , {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            .json(new ApiResponse('User logged in successfully', 200, user));


    } catch (error) {
        next(new ErrorResponse(error.message, 500));
    }
}

export const logout = async (req, res, next) => {
    try {
        let user = await User.findById(req.user._id);

        if(!user) {
            throw new ErrorResponse('User not found' , 404);
        }

        await user.clearRefreshToken();

        return res.status(200)
            .cookie('token' , null , {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 0
            })
            .cookie('refreshToken' , null , {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 0
            })
            .json(new ApiResponse('User logged out successfully', 200));

    } catch (error) {
        next(new ErrorResponse(error.message, 500));
    }
}

export const refresh = async (req, res, next) => {
    try {
        let refreshToken = req.cookies.refreshToken;

        if(!refreshToken) {
            throw new ErrorResponse('Refresh token not found' , 404);
        }

        const user = await User.findOne({ refreshToken });  

        if(!user) {
            throw new ErrorResponse('User not found' , 404);
        }

        return res.status(200)
            .cookie('token' , user.generateAccessToken() , {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            })
            .cookie('refreshToken' , user.generateRefreshToken() , {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            .json(new ApiResponse('User logged in successfully', 200, user));

    } catch (error) {
        next(new ErrorResponse(error.message, 500));
    }
}

export const getProfile = async (req, res, next) => {
    try {
        let user = await User.findById(req.user._id);

        if(!user) {
            throw new ErrorResponse('User not found' , 404);
        }

        return res.status(200).json(new ApiResponse('User fetched successfully', 200, user));

    } catch (error) {
        next(new ErrorResponse(error.message, 500));
    }
}

export const getAllUsers = async (req, res, next) => {
    try {
        let users = await User.find({_id: {$ne: req.user._id}});

        if(!users) {
            throw new ErrorResponse('Users not found' , 404);
        }

        return res.status(200).json(new ApiResponse('Users fetched successfully', 200, users));

    } catch (error) {
        next(new ErrorResponse(error.message, 500));
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        let user = await User.findById(req.user._id);

        if(!user) {
            throw new ErrorResponse('User not found' , 404);
        }

        await user.deleteOne();

        return res.status(200)
        .clearCookie('token')
        .clearCookie('refreshToken')
        .json(new ApiResponse('User deleted successfully', 200));

    } catch (error) {
        next(new ErrorResponse(error.message, 500));
    }
}

