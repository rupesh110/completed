import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const userToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1hour',
    });

    res.cookie('userToken', userToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60* 60* 1000, // 1 hour
    });
}

export default generateToken;