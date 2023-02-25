const express = require("express")
const {createAccount , login , forgetPass , resetPass , randomQuote} = require("../controller/user")
const passport = require("passport")
const router = express.Router()

router.post("/signup" , createAccount)
router.post("/login" , login)
router.post("/forgetpass" , forgetPass)
router.put("/resetpass" , resetPass)
// router.get("/signup-google", function(req , res , next){res.header("Access-Control-Allow-Origin", "*"); next()} , passport.authenticate('google' , {scope:['profile']}))
// router.get("/google/callback" , passport.authenticate('google' , {failureRedirect:"/"}) , (req , res) => {
//     res.redirect("http://localhost:5000/note.html")
// })

router.get("/randomQuote" , randomQuote)




module.exports = router