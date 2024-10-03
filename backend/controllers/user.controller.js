import { User } from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }
        //check user is already registered or not
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "user already exist with this email",
                success: 'false'
            })
        }
        //Convert password into hash using bcrypt
        const hashPassword = await bcryptjs.hash(password, 10)

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashPassword,
            role
        })
        return res.status(201).json({
            message: "Account created successfully",
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        if (!email || !password || !role) {
            res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }
        // Eamil is already exist or not in database
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        const isPasswordMatch = await bcryptjs.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status().json({
                message: "Incorrect email or password",
                success: false
            })
        }
        //check role is correct ro not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account does not exist with current role",
                success: false
            })
        }
        // Generate token
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' })

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body
        const file = req.file
     
        let skillsArray;
        if(skills){
            skillsArray = skills.split(",")
        }
        const userId = req.id
        let user = await User.findById(userId)

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        //Data updated
        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber) user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray

        await user.save()

        user = {
            _id : user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).json({
            message: "Profile updated Successfully.",
            user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}