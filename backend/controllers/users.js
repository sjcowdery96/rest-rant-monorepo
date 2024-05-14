const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt') 

const { User } = db

router.post('/', async (req, res) => {
    //check for existing user
    const existingUser = await User.find(req.body.email)
    if (existingUser) {
        //attempt login
        console.log("Username exists!")
        //try to match password
        const pwmatch = await bcrypt.compare(requestBody.password, existingUser.password)
        if (pwmatch) {
            //password matches -- login success
            console.log("Login Success!")
        }
        else {
            //no match
            console.log("Passwords don't match")
        }
    }
    else {
        //create new user
        //hash new password 
        const hashedPW = await bcrypt.hash(req.body.password, 10)
        //save user with email and hashed PW
        const user = await User.create({
            email: req.body.email,
            password: hashedPW
        })
        //return the user details
        res.json(user)
    }
})


router.get('/', async (req, res) => {
    const users = await User.findAll()
    res.json(users)
})

module.exports = router
