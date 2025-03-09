import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password is required only if googleId is not present
        }
    },
    googleId: {
        type: String,
        sparse: true // Allows null values but ensures uniqueness for non-null values
    },
    profilePicture: {
        type: String,
        default: ''
    }
}, {
    timestamps: true,
})

const User = mongoose.model("User", userSchema);

export default User;