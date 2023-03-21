// Description: This file contains all the firebase scripts used in the website.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, collection, addDoc, doc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Your web app's Firebase configuration
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
const db = getFirestore(app);

// registers a new user
if(document.getElementById('registerSubmitButton') != null) {
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
}

// get user interaction details and store them in firebase cloud firestore
function storeUserInteractionDetails() {
    const userInteractionDetails = collection(db, "userInteractionDetails");
    const staffName = document.getElementById("staffName").value;
    const staffRole = document.getElementById("staffRole").value;
    const staffDepartment = document.getElementById("staffDepartment").value;
    const staffContact = document.getElementById("staffContact").value;
    const visitDate = document.getElementById("visitDate").value;
    const visitPurpose = document.getElementById("visitPurpose").value;
    const visitStatus = document.getElementById("visitStatus").value;
    const orgName = document.getElementById("orgName").value;
    const orgAddress = document.getElementById("orgAddress").value;
    const orgType = document.getElementById("orgType").value;
    const dateSubmitted = new Date();

    const docRef = addDoc(collection(db, "unverifiedInteractions"), {
        staffName: staffName,
        staffRole: staffRole,
        staffDepartment: staffDepartment,
        staffContact: staffContact,
        visitDate: visitDate,
        visitPurpose: visitPurpose,
        visitStatus: visitStatus,
        orgName: orgName,
        orgAddress: orgAddress,
        orgType: orgType,
        dateSubmitted: dateSubmitted,
    })
    .then(() => {
        alert("Your interaction details have been submitted for verification. You will be notified once your details have been verified.");
        window.location.href = "dashboard.html";
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
    console.log("Document written with ID: ", docRef.id);
};

// add event listener to ind int submit button
if(document.getElementById('indIntSubmit') != null) {
    document.getElementById('indIntSubmit').addEventListener('click', async (e) => {
        e.preventDefault();
        storeUserInteractionDetails();
    });
}