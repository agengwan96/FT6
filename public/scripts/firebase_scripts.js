// Description: This file contains all the firebase scripts used in the website.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

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
};

// create table for unverified interactions
if (document.getElementById('unverifiedInteractionsTable') != null) {
    const unverifiedInteractionsTable = document.getElementById('unverifiedInteractionsTable');
    const unverifiedInteractionsTableBody = document.getElementById('unverifiedInteractionsTableBody');
    
    const querySnapshot = await getDocs(collection(db, "unverifiedInteractions"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        let row = unverifiedInteractionsTableBody.insertRow();
        let staffName = row.insertCell(0);
        let staffRole = row.insertCell(1);
        let staffDepartment = row.insertCell(2);
        let staffContact = row.insertCell(3);
        let visitDate = row.insertCell(4);
        let visitPurpose = row.insertCell(5);
        let visitStatus = row.insertCell(6);
        let orgName = row.insertCell(7);
        let orgAddress = row.insertCell(8);
        let orgType = row.insertCell(9);
        let dateSubmitted = row.insertCell(10);
        let verifyButton = row.insertCell(11);
        let rejectButton = row.insertCell(12);

        staffName.innerHTML = doc.data().staffName;
        staffRole.innerHTML = doc.data().staffRole;
        staffDepartment.innerHTML = doc.data().staffDepartment;
        staffContact.innerHTML = doc.data().staffContact;
        visitDate.innerHTML = doc.data().visitDate;
        visitPurpose.innerHTML = doc.data().visitPurpose;
        visitStatus.innerHTML = doc.data().visitStatus;
        orgName.innerHTML = doc.data().orgName;
        orgAddress.innerHTML = doc.data().orgAddress;
        orgType.innerHTML = doc.data().orgType;
        dateSubmitted.innerHTML = doc.data().dateSubmitted;
        verifyButton.innerHTML = '<button class="btn btn-primary" onclick="verifyInteraction(\'' + doc.id + '\')">Verify</button>';
        rejectButton.innerHTML = '<button class="btn btn-danger" onclick="rejectInteraction(\'' + doc.id + '\')">Reject</button>';
    });
};