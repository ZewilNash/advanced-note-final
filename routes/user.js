const express = require("express")
const {createAccount , login , forgetPass , resetPass , randomQuote} = require("../controller/user")
const passport = require("passport")
const router = express.Router()

const authMiddleWare = (req , res , next) => {
  res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, 
    Accept, x-client-key, x-client-token, x-client-secret, Authorization");
     next();
}

router.post("/signup" , authMiddleWare , createAccount)
router.post("/login" , authMiddleWare , login)
router.post("/forgetpass" , authMiddleWare , forgetPass)
router.put("/resetpass" , authMiddleWare , resetPass)
// router.get("/signup-google", function(req , res , next){res.header("Access-Control-Allow-Origin", "*"); next()} , passport.authenticate('google' , {scope:['profile']}))
// router.get("/google/callback" , passport.authenticate('google' , {failureRedirect:"/"}) , (req , res) => {
//     res.redirect("http://localhost:5000/note.html")
// })

router.get("/randomQuote" , randomQuote)




module.exports = router
