/* Variables */
const form = document.getElementById('loginForm');
const emailField = document.getElementById('emailTextField');
const passwordField = document.getElementById('passwordTextField');

/* Validates email to be an @murdoch.edu.au domain using regex */
function ValidateMurdochEmail() {
    var mailformat = /^\w+([\.-]?\w+)*@murdoch.edu.au+$/;

    if (emailField.value.match(mailformat)) {
        alert("VALID EMAIL");
        return true;
    }
    alert("INVALID EMAIL");
    emailField.focus();
    return false;
}

/* Listener for form. Calls ValidateMurdochEmail() function and checks for authentcity.
   Need to modify this for authenticating with Firebase. */
form.addEventListener('submit', (e) => {
    if (emailField.value === '' || passwordField === '' ||
        emailField.value === null || passwordField === null ||
        ValidateMurdochEmail() === false) {
        e.preventDefault();
    }
})