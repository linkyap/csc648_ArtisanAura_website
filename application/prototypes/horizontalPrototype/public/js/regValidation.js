const username = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPass = document.getElementById('confirm');
const form = document.getElementById("form")
form.addEventListener('submit', regSubmit);

function regSubmit(event){
    event.preventDefault();
    validation();
}
function validEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.match(re);
}
function validPass(password){
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return password.match(re);
}

function validation(){
    const usernameVal = username.value.trim();
    const emailVal = email.value.trim();
    const passVal = password.value.trim();
    const confirmVal = confirmPass.value.trim();

    if (usernameVal == ''){
        setError(username, "Required");
    }
    else{
        setSuccess(username);
    }
    if (emailVal == ''){
        setError(email, "Required");
    }
    else if (!validEmail(emailVal)){
        setError(email, "Not a valid email")
    }
    else{
        setSuccess(email);
    }
    if (passVal == ''){
        setError(password, "Required");
    }
    else if(!validPass(passVal)){
        setError(password, "Password does not meet requirements")
    }
    else{
        setSuccess(password);
    }
    if (confirmVal == ''){
        setError(confirmPass, "Required");
    }
    else if(confirmVal != passVal){
        setError(confirmPass, "Does not match password");
    }
    else{
        setSuccess(confirmPass);
    }

}
function setError(element, message){
    const formControl = element.parentElement;
    const errorDisplay = formControl.querySelector('.error');
    errorDisplay.innerText = message;
    formControl.classList.add('error');
    formControl.classList.remove('success');
}
function setSuccess(element){
    const formControl = element.parentElement;
    const errorDisplay = formControl.querySelector('.error');
    errorDisplay.innerText = '';
    formControl.classList.add('success');
    formControl.classList.remove('error');
}