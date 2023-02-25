
let userDetailsDiv = document.querySelector(".user_details")
let addNoteBtn = document.querySelector("#add_note")
let noteInput = document.querySelector("#user_note")
let notesContainer = document.querySelector(".notes")
let noteForm = document.querySelector(".form")
let noteFormEdit = document.querySelector(".form-edit")
let editNoteBtn = document.querySelector("#edit_note")
let editNoteInput = document.querySelector("#edit_note_input")
let signOutBtn = document.querySelector("#signout")
let timingBtn = document.querySelector(".timing")
let timingFormSection = document.querySelector(".timing-task-form")
let timingTaskInput = document.querySelector("#timing-task")
let timeTaskInput = document.querySelector("#task-time")
let setTaskTimeBtn = document.querySelector("#set-timing")
let trophyIcon = document.querySelector(".trophy-icon")
let userCharacterSec = document.querySelector(".user-character")
let status = document.querySelector("#status")
let statustooltip = document.querySelector(".status-tooltip")
let persenttooltip = document.querySelector(".persent-tooltip")
let percent = document.querySelector(".percent")
let bestDayOfWeek = document.querySelector(".best-day-of-week")
let speakNoteBtn = document.querySelector("#speak-note")
let listenIcon = document.querySelector("#listen-icon")
let speakIcon = document.querySelector("#speak-icon")
let errorMessage = document.querySelector("#error")


let userData = JSON.parse(localStorage.getItem("user"))

let daysOfTheWeekLocalStorage = JSON.parse(localStorage.getItem("best-days")) || []


speakNoteBtn.addEventListener("click", async (e) => {

    // initialize the speech recogn
    let speechRecognition = window.webkitSpeechRecognition
    let recognition = new speechRecognition()

    recognition.start()

    let note = ""

    recognition.continuous = true

    // start recognition
    recognition.onstart = () => {
        speakIcon.classList.add("hide")
        listenIcon.classList.remove("hide")
    }

    recognition.onspeechend = () => {
        speakIcon.classList.remove("hide")
        listenIcon.classList.add("hide")
    }

    recognition.onerror = () => {
        speakIcon.classList.remove("hide")
        listenIcon.classList.add("hide")
        errorMessage.innerText = `No voice deticted try again`
        errorMessage.classList.remove("hide")


        setTimeout(() => {
            // errorMessage.innerText = `No voice deticted try again`
            errorMessage.classList.add("hide")
        }, 2000)
    }


    recognition.onresult = async (e) => {
        //get the index of the speech
        let current = e.resultIndex

        let transcript = e.results[current][0].transcript //we got the speech text
        note += transcript

        let payload = {
            note: note,
            user: userData._id
        }

        let noteData = await axios.post("/api/note/add", payload)

        let noteEl = noteData.data.note

        let noteDiv = document.createElement("div")
        noteDiv.classList.add("note")
        noteDiv.innerHTML = `
        <p ondblclick="removeChecked(this)" style="text-decoration:${note.isChecked ? "line-through" : "none"}" id="${note._id}" onclick="updateTaskComplete(this)">${noteEl.note}</p>
        ${noteEl.time ? '<p><i class="fa-solid fa-clock" style="color:#90EE90"></i></p>' : ""}
        <div class="tools">
            <i id="${noteEl._id}" onclick="editNote(this)" class="fa-solid fa-pen-to-square edit"></i>
            <i id="${noteEl._id}" onclick="deleteNote(this)" class="fa-solid fa-trash delete"></i>
        </div>
        `

        notesContainer.appendChild(noteDiv)

        console.log(noteData)

        console.log(note)
    }



    console.log(speechRecognition)
})


const calculateTrophyForUser = async () => {
    // trophy section
    let statusIcons = {
        rocket: {
            status: "You're a rocket",
            icon: "fa-rocket"
        },
        fire: {
            status: "You're a Fire",
            icon: "fa-fire"
        },
        digger: {
            status: "You're a digger",
            icon: "fa-person-digging"
        },

        king: {
            status: "You're a king",
            icon: "fa-crown"
        },


    }

    let payload = {
        user: userData._id
    }

    let allNotes = await axios.post("/api/note/all", payload)
    let notes = allNotes.data.notes
    let allNotesLength = notes.length

    console.log(allNotesLength)

    let checkedNotes = notes.filter(note => note.isChecked === true)

    console.log(checkedNotes.length)

    if (checkedNotes.length === 0) {
        status.classList.add(`${statusIcons.digger.icon}`)
        statustooltip.innerText = `${statusIcons.digger.status}`
    } else if (checkedNotes.length <= 4) {
        status.classList.add(`${statusIcons.rocket.icon}`)
        statustooltip.innerText = `${statusIcons.rocket.status}`
    } else if (checkedNotes.length <= 9) {
        status.classList.add(`${statusIcons.fire.icon}`)
        statustooltip.innerText = `${statusIcons.fire.status}`
    } else if (checkedNotes.length === 10) {
        document.body.style.backgroundImage = `url('./trophy.png')`
        document.body.style.backgroundSize = 'cover'
        status.classList.add(`${statusIcons.king.icon}`)
        statustooltip.innerText = `${statusIcons.king.status}`
    }

    // percent

    persenttooltip.innerText = `${checkedNotes.length}/${allNotesLength} completed tasks`
    percent.innerText = `${Math.floor((checkedNotes.length / allNotesLength) * 100)}%`

    calculateBestDayOfTheWeek(allNotesLength)
}



const calculateBestDayOfTheWeek = (notesLength) => {
    // const now = new Date().getTime();
    const endToday = new Date(new Date().setHours(23, 59, 59, 999));
    console.log(new Date(), endToday)
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var d = new Date();
    var dayName = days[d.getDay()];
    // every day push the score to local storage
    if (new Date() === endToday) {
        //do the logic
        let previousBestDays = JSON.parse(localStorage.getItem("best-days")) || []

        let todayScore = {
            checkedNotes: Number(notesLength),
            day: dayName
        }

        previousBestDays.push(todayScore)

        localStorage.setItem("best-days", JSON.stringify(previousBestDays))
    }


    // update the best day span
    if (daysOfTheWeekLocalStorage.length > 0) {
        let allDays = JSON.parse(localStorage.getItem("best-days"))
        let topDay = allDays.sort((a, b) => b.checkedNotes - a.checkedNotes)[0]

        bestDayOfWeek.innerText = topDay.day
    } else {
        bestDayOfWeek.innerText = dayName
    }

}




signOutBtn.addEventListener("click", (e) => {
    localStorage.removeItem("user")
    window.location.href = "/"
})


const removeChecked = async (note) => {
    let updatedNote = await axios.put(`/api/note/check/query?userId=${userData._id}&noteId=${note.id}`, { checked: false })
    note.style.textDecoration = "none"

    window.top.location = window.top.location
}

const updateTaskComplete = async (note) => {
    let updatedNote = await axios.put(`/api/note/check/query?userId=${userData._id}&noteId=${note.id}`, { checked: true })
    note.style.textDecoration = "line-through"
    window.top.location = window.top.location
}


const deleteNote = async (note) => {
    let msg = await axios.delete(`/api/note/delete/query?userId=${userData._id}&noteId=${note.id}`)
    console.log(msg)
    // window.location.href = "/note.html"
    let span = note.parentElement
    span.parentElement.remove()
    window.top.location = window.top.location
}

const editNote = async (note) => {
    noteForm.classList.add("hide")
    noteFormEdit.classList.remove("hide")

    editNoteBtn.addEventListener("click", async (e) => {
        let inputValue = editNoteInput.value
        if (!inputValue) return

        let noteEl = await axios.put(`/api/note/update/query?userId=${userData._id}&noteId=${note.id}`, { newNote: inputValue })
        console.log(noteEl)
        let targetNote = noteEl.data.newNote.note

        let toolsDiv = note.parentElement
        let noteDiv = toolsDiv.parentElement

        noteDiv.querySelector("p").innerText = targetNote

        noteForm.classList.remove("hide")
        noteFormEdit.classList.add("hide")

    })
}




const loadAllUserNotes = async () => {
    let payload = {
        user: userData._id
    }
    let allNotes = await axios.post("/api/note/all", payload)
    let notes = allNotes.data.notes
    console.log(notes)

 

    if (notes.length === 0) return

    notes.forEach(note => {
        let noteDiv = document.createElement("div")
        noteDiv.classList.add("note")
        noteDiv.innerHTML = `
        <p ondblclick="removeChecked(this)" style="text-decoration:${note.isChecked ? "line-through" : "none"}" id="${note._id}" onclick="updateTaskComplete(this)" >${note.note}</p>
        ${note.time ? '<p><i class="fa-solid fa-clock" style="color:#90EE90"></i></p>' : ""}
        <div class="tools">
            <i id="${note._id}" onclick="editNote(this)" class="fa-solid fa-pen-to-square edit"></i>
            <i id="${note._id}" onclick="deleteNote(this)" class="fa-solid fa-trash delete"></i>
        </div>
        `

        notesContainer.appendChild(noteDiv)
    })
}

window.onload = async () => {
    let user = JSON.parse(localStorage.getItem("user"))
    let { user_name, user_image } = user
    if (!user) {
        window.location.href = "/"
    }

    userDetailsDiv.innerHTML = `
            <img src="${user_image}" alt="">
            <span>${user_name}</span>
            <p>Fulfill your life with more achievements</p>
    `

    loadAllUserNotes()
    calculateTrophyForUser()

  
}

addNoteBtn.addEventListener("click", async (e) => {
    let note = noteInput.value
    if (!note) return

    let payload = {
        note: note,
        user: userData._id
    }

    let noteData = await axios.post("/api/note/add", payload)

    let noteEl = noteData.data.note

    let noteDiv = document.createElement("div")
    noteDiv.classList.add("note")
    noteDiv.innerHTML = `
    <p ondblclick="removeChecked(this)" style="text-decoration:${note.isChecked ? "line-through" : "none"}" id="${note._id}" onclick="updateTaskComplete(this)">${noteEl.note}</p>
    ${noteEl.time ? '<p><i class="fa-solid fa-clock" style="color:#90EE90"></i></p>' : ""}
    <div class="tools">
        <i id="${noteEl._id}" onclick="editNote(this)" class="fa-solid fa-pen-to-square edit"></i>
        <i id="${noteEl._id}" onclick="deleteNote(this)" class="fa-solid fa-trash delete"></i>
    </div>
    `

    notesContainer.appendChild(noteDiv)

    console.log(noteData)

})

// timing area

timingBtn.addEventListener("click", (e) => {
    timingFormSection.classList.toggle("hide")
})


const sendEmailNotificationToUser = async (noted) => {
    let note = noted
    let userId = userData._id
    //send to the user mail a notification
    let mail = await axios.post("/api/note/notification", { note: note, userId: userId })

    console.log(mail)

    // window.location.href = "/note.html"
}


setTaskTimeBtn.addEventListener("click", async (e) => {
    let time = timeTaskInput.value
    let note = timingTaskInput.value
    let userId = userData._id


    if (!time || !note) return

    console.log(time, note, userId)

    let timedNote = await axios.put("/api/note/time", { note: note, userId: userId, time: time })

    console.log(timedNote)
    // window.location.href = "/note.html"

    await sendEmailNotificationToUser(timedNote)
    window.location.href = "/note.html"
})


trophyIcon.addEventListener("click", (e) => {
    userCharacterSec.classList.toggle("hide")
})


