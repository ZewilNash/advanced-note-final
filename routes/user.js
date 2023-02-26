const express = require("express")
const {createAccount , login , forgetPass , resetPass , randomQuote} = require("../controller/user")
const passport = require("passport")
const router = express.Router()


router.post("/signup"  , createAccount)
router.post("/login"  , login)
router.post("/forgetpass"  , forgetPass)
router.put("/resetpass"  , resetPass)

router.get("/randomQuote" , randomQuote)




module.exports = router
