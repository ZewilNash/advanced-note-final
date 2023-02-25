const User = require("../model/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const quotes = require("../randomQotes")




const createAccount = async (req, res) => {
    try {

        let { first_name, last_name, password, email, user_image } = req.body
        let hash = await bcrypt.hash(password, 10);

        let user_name = `${first_name}-${new Date().getSeconds()}-${last_name}`

        let newUser = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hash,
            user_image: user_image,
            user_name: user_name,
        }

        let userData = await User(newUser)

        const token = jwt.sign(
            { user_id: userData._id, email },
            process.env.WEB_TOKEN_SECRET,
            {
                expiresIn: "2h"
            }
        )

        userData.token = token
        await userData.save()

        res.status(200).json({ success: true, msg: "User created Successfully", user: userData })


    } catch (error) {
        res.status(400).json({ error });
    }


}

const login = async (req, res) => {
    try {
        let { email, password } = req.body
        let userWithEmail = await User.findOne({ email: email })

        if (userWithEmail) {
            const result = await bcrypt.compare(password, userWithEmail.password)
            if (result) {
                const token = jwt.sign(
                    { user_id: userWithEmail._id, email },
                    process.env.WEB_TOKEN_SECRET,
                    { expiresIn: "2h" }
                )

                userWithEmail.token = token
                res.status(200).json({ success: true, msg: "You Logged In Successfully", user: userWithEmail })

            } else {
                res.status(400).json({ error: "password doesn't match" })
            }
        } else {
            res.status(400).json({ error: "User doesn't exist" });
        }

    } catch (err) {
        res.status(400).json({ error });
    }
 

}


const forgetPass = async (req, res) => {
    try {

        const { email } = req.body
        let user = await User.findOne({ email })

        if (user) {
            //logic go here
            return res.status(200).json({ verified: true, email: email })
        } else {
            return res.status(400).json({ error: "User With this email not found" })
        }

    } catch (err) {
        res.status(400).json({ err })
    }


}


const resetPass = async (req, res) => {


        let { new_pass, email } = req.body
        console.log(new_pass , email)
        let hashedNewPass = await bcrypt.hash(new_pass, 10)

        let databaseUser = await User.findOneAndUpdate({email} , {password:hashedNewPass} , {new:true})
        console.log(databaseUser)

        res.status(200).json({success:true , msg:"Password reset Succesfully" , newUser:databaseUser})

    
}

const randomQuote = async (req , res) => {
    let selectedQuote = quotes.quotes[Math.floor(Math.random() * quotes.quotes.length)]

    res.status(200).json({success:true , quote:selectedQuote})
}



module.exports = { createAccount, login, forgetPass, resetPass , randomQuote}