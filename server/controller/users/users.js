import asyncHandler from 'express-async-handler';
import User from '../../models/userModel.js';
import generateToken from '../../utils/generateToken.js';
import decodeToken from '../../utils/decodeToken.js';

// Register user
// @desc    POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { email, password, country, description} = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        throw new Error('User already exists');
    }

    const user = await User.create({
        email,
        password,
        country,
        description
    });

    if(user){
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            email: user.email,
        });
    }else{
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// Auth user & get token
// @desc    POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
    
        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);
            res.status(200).json({
                _id: user._id,
                email: user.email,
                password: user.password,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error in authUser:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//@desc Logout user
//@route POST /api/users/logout
//@access Public
const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('userToken');
    res.status(200).json({ message: 'User logged out' });
})




//@dec Get user profile
//@route GET /api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
    console.log('req.cookies.userToken', req.cookies.userToken);
    try {
        // const userToken = req.cookies.userToken;
        const userId = decodeToken(req);
        console.log('userId', userId);

        if (!userId) {
            res.status(401).json({ message: 'Not authorized, token failed' });
            throw new Error('Not authorized, token failed');
        }else{
            const user = await User.findById(userId);
            if(user){
                res.status(200).json({
                    _id: user._id,
                    email: user.email,
                    description: user.description,
                    country: user.country
                });
            }else{
                res.status(404).json({ message: 'User not found' });
            }
        }
    } catch (error) {
        // Handle other errors
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//@desc Update user profile
//@route PUT /api/users/profile
//@access Private
const updateProfile = async (req, res) => {
  const userId = decodeToken(req);
  const user = await User.findById(userId);

  if(user){
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    user.description = req.body.description || user.description;
    user.country = req.body.country || user.country;
    
    if(req.body.password){
        user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
        email: updatedUser.email,
        description: updatedUser.description,
        country: updatedUser.country
    });
  }
};

export { registerUser, authUser, logoutUser, getUserProfile, updateProfile };
