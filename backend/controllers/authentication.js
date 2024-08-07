const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')
//adding JWT library
const jwt = require('json-web-token')

const { User } = db
//adds to database
router.post('/', async (req, res) => {
    let user = await User.findOne({
        where: { email: req.body.email }
    })
    //No user found
    if (!user) {
        res.status(404).json({ message: 'no user found' })
    }
    //user found, bad password
    else if (!await bcrypt.compare(req.body.password, user.passwordDigest)) {
        res.status(404).json({ message: 'invalid password!' })
    }
    else {
        //else return that user we found with matched password
        const result = await jwt.encode(process.env.JWT_SECRET, { id: user.userId })
        //return response with user and JWT 
        res.json({ user: user, token: result.value })
    }
})
//retrieves profiles in database based on current logged in user profile
//---copied from assignment
router.get('/profile', async (req, res) => {
    try {
        // Split the authorization header into [ "Bearer", "TOKEN" ]:
        const [authenticationMethod, token] = req.headers.authorization.split(' ')

        // Only handle "Bearer" authorization for now 
        //  (we could add other authorization strategies later):
        if (authenticationMethod == 'Bearer') {

            // Decode the JWT
            const result = await jwt.decode(process.env.JWT_SECRET, token)

            // Get the logged in user's id from the payload
            const { id } = result.value

            // Find the user object using their id:
            let user = await User.findOne({
                where: {
                    userId: id
                }
            })
            res.json(user)
        }
    } catch {
        res.json(null)
    }
})

module.exports = router

