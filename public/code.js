let toSignupBtn = document.querySelector(".to-signup")
let toLoginBtn = document.querySelector(".to-login")
let signUpForm = document.querySelector(".signup")
let loginForm = document.querySelector(".login")
let formContainer = document.querySelector(".form")
let forgetPassBtn = document.querySelector("#forget_pass")
let forgetPassForm = document.querySelector(".forgetPass")
let fromForgotToLoginBtn = document.querySelector(".forgetPass .to-login")
let inputUserImage = document.querySelector(".signup #user_image")
let forgetPassSubmit = document.querySelector("#forget_pass_submit")
let forgetPassInput = document.querySelector(".forgetPass #email")
let forgetPassFinalStepDiv = document.querySelector(".final-step")
let toForgetPassBtn = document.querySelector(".to-forgetpass")
let forgetPassNewPass = document.querySelector("#new-password")
let forgetPassConfirmNewPass = document.querySelector("#confirm-new-password")
let forgetPassFinalStepSubmit = document.querySelector("#forget_pass_final_submit")
let toast = document.querySelector(".toast")
let loginWithGoogleBtn = document.querySelector("#google_btn")
let quoteEl = document.querySelector("#quote")
let quoteAuthor = document.querySelector("#quote-author")

// signup && login 
let signupBtn = document.querySelector("#signup")
let loginBtn = document.querySelector("#login")

const generateRandomQuote = async () => {
    let quoteRes = await axios.get("/api/user/randomQuote")
    console.log(quoteRes)
    let quote = quoteRes.data.quote

    quoteEl.innerText = `${quote.quote}`
    quoteAuthor.innerText  = `~ ${quote.author}`
}
generateRandomQuote()

window.onload = async () => {
    let user = JSON.parse(localStorage.getItem("user"))
    if (!user) return
    let { token } = user

    if (token) {
        window.location.href = "/note.html"
    }

    
}

inputUserImage.addEventListener("change", (e) => {
    let image = e.target.files[0]
    let src = URL.createObjectURL(image)
    document.querySelector(".signup .user_image label").style.background = `url('${src}')`
    document.querySelector(".signup .user_image label").style.backgroundSize = "cover"

})


signupBtn.addEventListener("click", async (e) => {
    let first_name = document.querySelector(".signup #first_name").value
    let last_name = document.querySelector(".signup #last_name").value
    let email = document.querySelector(".signup #email").value
    let password = document.querySelector(".signup #password").value
    let confirm_pass = document.querySelector(".signup #cpnfirm_pass").value
    let inputImage = document.querySelector(".signup #user_image").files[0]

    if (!first_name || !last_name || !email || !password || !confirm_pass || !inputImage) return


    // let data = await axios.post("/api/user/signup")
    //my cloud name
    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/futuretodosod/image/upload';
    const CLOUDINARY_UPLOAD_PRESET = 'uwpmv7sg'; //find my prest upload and my upload name cloud

    const file = inputImage
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    let imageData = await fetch(CLOUDINARY_URL, { method: "POST", body: formData })
    let result = await imageData.json()
    let user_image = result.url

    let newUser = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        confirm_pass: confirm_pass,
        user_image: user_image
    }

    let userData = await axios.post("http://localhost:5000/api/user/signup", newUser)
    console.log(userData)

    
        let user = userData.data.user

        console.log(user)

        localStorage.setItem("user", JSON.stringify(user))

         window.location.href = "/note.html"
    
   

})


loginBtn.addEventListener("click", async (e) => {
    let email = document.querySelector(".login #email").value
    let password = document.querySelector(".login #password").value

    if(!email || !password) {
        
        return
    
    }else {

    let newUser = {
        email: email,
        password: password,
    }

    let userData = await axios.post("http://localhost:5000/api/user/login", newUser)


        let user = userData.data.user

        console.log(user)
    
        localStorage.setItem("user", JSON.stringify(user))
    
        window.location.href = "/note.html"
    

}

})



toSignupBtn.addEventListener("click", (e) => {
    signUpForm.classList.remove("hide")
    loginForm.classList.add("hide")
})

toLoginBtn.addEventListener("click", (e) => {
    signUpForm.classList.add("hide")
    loginForm.classList.remove("hide")
})

forgetPassBtn.addEventListener("click", () => {
    loginForm.classList.add("hide")
    forgetPassForm.classList.remove("hide")
})

fromForgotToLoginBtn.addEventListener("click", () => {
    loginForm.classList.remove("hide")
    forgetPassForm.classList.add("hide")
})



forgetPassSubmit.addEventListener("click" , async (e) => { 
    let email = forgetPassInput.value
    if(!email) return
    let data = await axios.post("/api/user/forgetpass" , {email:email})
    let verified = data.data.verified

    if(verified){
        forgetPassForm.classList.add("hide")
        forgetPassFinalStepDiv.classList.remove("hide")
    }


})

toForgetPassBtn.addEventListener("click" , (e) => {
    forgetPassFinalStepDiv.classList.add("hide")
    forgetPassForm.classList.remove("hide")
})


forgetPassFinalStepSubmit.addEventListener("click" , async(e) => {
    let newPass = forgetPassNewPass.value
    let confirm_new_pass = forgetPassConfirmNewPass.value
    let email = forgetPassInput.value
    if(!newPass || !confirm_new_pass || !email) return
    console.log(newPass , confirm_new_pass)
    
    if(!(newPass === confirm_new_pass)) {
        return
    }else {
        //new_pass, email
        
        let data = await axios.put("/api/user/resetpass" , {new_pass:newPass , email:email})

        setTimeout(() => {
            toast.innerText = `reset success,We will direct you to login`
            toast.style.animation = `toast-show 1s ease`
        } , 2000)

        setTimeout(() => {
            toast.style.animation = `toast-hide 1s ease`
            window.location.href = "/"
        } , 3000)

        // window.location.href = "/"

    }

   

})


