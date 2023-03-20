import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBw1ySW4GfUqEeRtpBTYgCGeMSLC3ru4QU",
    authDomain: "muworldv1-ft6.firebaseapp.com",
    databaseURL: "https://muworldv1-ft6-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "muworldv1-ft6",
    storageBucket: "muworldv1-ft6.appspot.com",
    messagingSenderId: "659133217389",
    appId: "1:659133217389:web:386e36e80f023670421d64",
    measurementId: "G-BQJCVKPBJN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

/* registerForm.addEventListener('submit', (e) => {
    if (emailField.value === '' || passwordField === '' ||
        emailField.value === null || passwordField === null ||
        ValidateMurdochEmail() === false) {
        e.preventDefault();
    }
}) */

document.getElementById('registerSubmitButton').addEventListener('click', (e) => {
    e.preventDefault();
    const emailVar = document.getElementById('emailRegisterField').value;
    const passwordVar = document.getElementById('passwordRegisterField').value;

    createUserWithEmailAndPassword(auth, emailVar, passwordVar)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
        alert('successfully created acc');

        sendEmailVerification(user)
        .then(() => {
            // Email verification sent!
            let msg = 'An email verification link has been sent to ' + user.email;
            alert(msg);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        alert(errorMessage);
    });
});

/* Signs user in site */
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

// get user interaction details and store them in firebase cloud firestore
function storeUserInteractionDetails() {
    const db = firebase.firestore();
    db.collection("userInteractionDetails").add({
        staffName: document.getElementById("staffName").value,
        staffRole: document.getElementById("staffRole").value,
        staffDepartment: document.getElementById("staffDepartment").value,
        staffContact: document.getElementById("staffContact").value,
        visitDate: document.getElementById("visitDate").value,
        visitPurpose: document.getElementById("visitPurpose").value,
        visitStatus: document.getElementById("visitStatus").value,
        orgName: document.getElementById("orgName").value,
        orgAddress: document.getElementById("orgAddress").value,
        orgType: document.getElementById("orgType").value,
        dateSubmitted: new Date(),
    })
    .then((docRef) => {
        alert("Your details have been submitted successfully!");
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
};

document.getElementById('indIntSubmit').addEventListener('click', (e) => {
    alert('test');
    //e.preventDefault();
   // storeUserInteractionDetails();
});