import jwt from 'jsonwebtoken';

const decodeToken = (req) => {
    try {
        const token = req.cookies.userToken;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const {id, exp } = decodedToken;

            if(exp < new Date().getTime() / 1000){
                return "expired";
            }
        return id;
    } catch (error) {
        // Handle JWT verification errors
        console.error('JWT Verification Failed:', error.message);
        return null; // or throw an error, depending on your use case
    }
}

export default decodeToken;
