
const Note = require("../model/note")
const User = require("../model/user")
const nodeMailer = require("nodemailer")

const addNote = async (req, res) => {
    let { note, user } = req.body

    if (!note || !user) {
        return res.status(200).json({ error: "Note is required" })
    }


    let newNote = {
        note: note,
        user: user,
       
    }

    let userNote = await Note(newNote)

    await userNote.save()

  


    res.status(200).json({ success: true, note: userNote })
}


const getUserNotes = async (req, res) => {
    let { user } = req.body

    if (!user) {
        return res.status(200).json({ success: false, error: "Provide a user" })
    }

    let allUserNotes = await Note.find({ user: user })

    console.log(allUserNotes)

    res.status(200).json({ success: true, notes: allUserNotes })
}


const deleteNote = async (req, res) => {
    let { userId, noteId } = req.query
    if (!userId || !noteId) {
        return res.status(200).json({ success: false, error: "Please Provide ids" })
    }

    let deletedNote = await Note.findOneAndDelete({ user: userId, _id: noteId })

    res.status(200).json({ success: true, msg: "Note has been deleted succesfully" })
}

const updateUserNote = async (req, res) => {
    let { userId, noteId } = req.query
    let { newNote } = req.body
    if (!userId || !noteId) {
        return res.status(200).json({ success: false, error: "Please Provide ids" })
    }

    let updatedNote = await Note.findOneAndUpdate({ user: userId, _id: noteId }, { note: newNote }, { new: true })

    res.status(200).json({ success: true, msg: "Note updated Succesfully", newNote: updatedNote })
}

const updateTaskComplete = async (req, res) => {
    let { userId, noteId } = req.query
    let { checked } = req.body

    if (!userId || !noteId) {
        return res.status(200).json({ success: false, error: "Please Provide ids" })
    }

    let updatedNote = await Note.findOneAndUpdate({ user: userId, _id: noteId }, { isChecked: checked }, { new: true })
    res.status(200).json({ success: true, msg: "Note updated Succesfully", newNote: updatedNote })
}


const setTaskTime = async (req, res) => {


    let { time, note, userId } = req.body
    console.log(time, note, userId)

    let noteEl = await Note.findOneAndUpdate({ note: note, user: userId }, { time: time }, { new: true })
    console.log(noteEl)
    if (noteEl) {
        return res.status(200).json({ msg: "Time added succesfully", note: noteEl })

    }
  

}


const sendNotificationToUser = async (req, res) => {


    let { note, userId } = req.body

    let { email, user_name } = await User.findById(userId)
    console.log(email)

    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_USER_NAME,
            pass: process.env.GMAIL_PASSWORD,
        }
    })

    let mailOptions = {
        from: process.env.GMAIL_USER_NAME,
        to: `${email}`,
        subject: "Noty App Inform You That An Important Task Waiting To be Fulfilled Now...",
        text: `${user_name} Please Don't Forget To ${note.data.note.note}`
    }

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${year}/${month}/${day}`

    let noteTime = note.data.note.time.split(":")
   

    

    var time = Math.abs(new Date() - new Date(`${currentDate} ${noteTime[0]}:${noteTime[1]}:00`));

    setTimeout(async () => {

        let mail = await transporter.sendMail(mailOptions)
        if (mail) {
            return res.status(200).json({ success: true, msg: "Mail has been sent successfully" })
        }

    }, time)

    console.log(time)

}

module.exports = {
    addNote, getUserNotes, deleteNote, updateUserNote, updateTaskComplete, setTaskTime,
    sendNotificationToUser
}