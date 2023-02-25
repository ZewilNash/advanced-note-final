// const GoogleStratagy = require("passport-google-oauth20").Strategy
// const User = require("../model/user")

// //initialize google strategy
// module.exports = function (passport) {
//     passport.use(new GoogleStratagy({
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: "/api/user/google/callback"
//     }, async (accessToken, refreshToken, profile, done) => {
//         console.log(profile)
//     }))

//     passport.serializeUser(function(user , done){
//         done(null , user.id)
//     })

//     passport.deserializeUser(function(id , done){
//         User.findById(id , (err , user) => {
//             done(err , user)
//         })
//     })
// }
