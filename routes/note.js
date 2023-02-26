const express = require("express")
const {
    addNote , getUserNotes , deleteNote , updateUserNote , updateTaskComplete , setTaskTime,
    sendNotificationToUser
} = require("../controller/note")
const router = express.Router()


router.post("/add"  , addNote)
router.post("/all"  , getUserNotes)
router.delete("/delete/query"  , deleteNote)
router.put("/update/query"  , updateUserNote)
router.put("/check/query"  , updateTaskComplete)
router.put("/time"  , setTaskTime)
router.put("/time"  , setTaskTime)
router.post("/notification"  , sendNotificationToUser)


module.exports = router
