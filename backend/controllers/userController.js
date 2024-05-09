const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

//Register new User
//route POST /api/users
//access public 
const  registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body // body data

    if (!name || !email || !password) { // validation
        res.status(400)
        throw new Error('Please check all fields')
       } 

    //To check if the user exists and verbot registration 
    const userExists = await User.findOne({ email })

        if (userExists){
            res.status(400)
            throw new Error('User already exixts')
        } 

    //Hash password before creating a User
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

            //Create User 
            const user = await User.create ({
                name, 
                email, 
                password: hashedPassword,
            })
            if(user){
                res.status(201).json({ //Send user data back 
                    _id: user.id, 
                    name: user.name, 
                    email: user.email,
                    token: generateToken(user._id),
                })
            } else {
                res.status(400)
                throw new Error('Invalid user Data')
            }  
    })

//Login - authenticate a User
//route POST /api/users/login
//access public 
const  loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body

    //verify user by email
    const user = await User.findOne({email})

    //here you compare hashed password and blank password
    if(user && (await bcrypt.compare(password, user.password))) { 
        res.json({
            _id: user.id,
            name: user.name, 
            email: user.email,
            token: generateToken(user._id),
        })
    }  else {
        res.status(400)
        throw new Error('Invalid Credentials')
    }  
})

//Get user data
//route GET /api/users/me
//access Private 
const  getMe = asyncHandler(async(req, res) => {
    res.status(200).json(req.user)
})

//Generate JWT
const generateToken = (id) => {
    return jwt.sign ({ id }, process.env.JWT_SECRET,{
        expiresIn: '90d', //optional 
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
}
