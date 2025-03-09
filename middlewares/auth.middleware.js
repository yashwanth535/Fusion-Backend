import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authorize = async (req, res, next) => {
    try {

        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){ 
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            res.status(401).send({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user){
            res.status(401).send({ message: "Unauthorized" });
        }

        req.user = user;
        next();
        
    } catch (error) {
        res.status(401).send({ message: "Unauthorized", error:error.message });
    }
}

export default authorize;