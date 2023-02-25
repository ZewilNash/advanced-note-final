const express = require("express")
const {
    addNote , getUserNotes , deleteNote , updateUserNote , updateTaskComplete , setTaskTime,
    sendNotificationToUser
} = require("../controller/note")
const router = express.Router()

const authMiddleWare = (req , res , next) => {
  res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, 
    Accept, x-client-key, x-client-token, x-client-secret, Authorization");
     next();
}

router.post("/add" , authMiddleWare , addNote)
router.post("/all" , authMiddleWare , getUserNotes)
router.delete("/delete/query" , authMiddleWare , deleteNote)
router.put("/update/query" , authMiddleWare , updateUserNote)
router.put("/check/query" , authMiddleWare , updateTaskComplete)
router.put("/time" , authMiddleWare , setTaskTime)
router.put("/time" , authMiddleWare , setTaskTime)
router.post("/notification" , authMiddleWare , sendNotificationToUser)


module.exports = router
