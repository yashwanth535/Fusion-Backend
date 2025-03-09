import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/user.model.js";

const userValidation = z.object({
    name: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6).max(30),
    confirmPassword: z.string().min(6).max(30),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});



export const signUp = async (req, res) => {

    const validation = userValidation.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors[0].message });
    }

    try {

        const { name, email, password } = req.body;

        const userExists = await User
            .findOne({ email });

        if (userExists) {
            return res.status(400).send({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).send({ 
            message: "User created successfully" ,
            data:{
                user: user,
                token: token,
            }
        });
        
        
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}