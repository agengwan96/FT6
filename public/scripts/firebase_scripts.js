// Description: This file contains all the firebase scripts used in the website.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDocs, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

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

// Redirect to admin.html if user is admin
async function checkAdmin() {
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.data().role === "admin") {
        window.location.href = './pages/admin.html';
    }
}

function addClickListener(elementId, callback) {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener('click', callback);
    }
}

addClickListener('adminPanel', async (e) => {
    await checkAdmin();
});

// registers a new user
addClickListener('registerSubmitButton', async (e) => {
    e.preventDefault();
    const emailVar = document.getElementById('emailRegisterField').value;
    const passwordVar = document.getElementById('passwordRegisterField').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, emailVar, passwordVar);
        const user = userCredential.user;
        alert('Successfully created account');
        await sendEmailVerification(user);
        alert(`An email verification link has been sent to ${user.email}`);
    } catch (error) {
        alert(error.message);
    }
});

// get user interaction details and store them in firebase cloud firestore
addClickListener('indIntSubmit', async (e) => {
    e.preventDefault();
    if (document.getElementById('staffName').value === '' || document.getElementById('staffRole').value === '' || document.getElementById('staffDepartment').value === '' || document.getElementById('staffContact').value === '' || document.getElementById('visitDate').value === '' || document.getElementById('visitPurpose').value === '' || document.getElementById('visitStatus').value === '' || document.getElementById('orgName').value === '' || document.getElementById('orgAddress').value === '' || document.getElementById('orgType').value === '') {
        alert('Please fill in all the fields');
        return;
    }

    const formData = {};
    const fieldIds = ['staffName', 'staffRole', 'staffDepartment', 'staffContact', 'visitDate', 'visitPurpose', 'visitStatus', 'orgName', 'orgAddress', 'orgType'];

    fieldIds.forEach(id => {
        formData[id] = document.getElementById(id).value;
    });

    formData.dateSubmitted = new Date();

    try {
        const docRef = await addDoc(collection(db, "unverifiedInteractions"), formData);
        alert("Your interaction details have been submitted for verification. You will be notified once your details have been verified.");
        window.location.href = "dashboard.html";
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
});

// create table for unverified interactions
async function createUnverifiedInteractionsTable() {
    const unverifiedInteractionsTableBody = document.getElementById('unverifiedInteractionsTableBody');
    const querySnapshot = await getDocs(collection(db, "unverifiedInteractions"));

    // Convert the querySnapshot into an array of objects containing the document ID and data
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));

    // Sort the data array based on the 'date submitted' field
    data.sort((a, b) => {
        const dateA = a.data.dateSubmitted.toDate();
        const dateB = b.data.dateSubmitted.toDate();
        return dateA - dateB;
    });

    // Insert the sorted data into the table
    data.forEach(({ id, data: rowData }) => {
        let row = unverifiedInteractionsTableBody.insertRow();

        const fieldNames = ['staffName', 'staffRole', 'staffDepartment', 'staffContact', 'visitDate', 'visitPurpose', 'visitStatus', 'orgName', 'orgAddress', 'orgType', 'dateSubmitted'];

        fieldNames.forEach((fieldName, index) => {
            let cell = row.insertCell(index);
            cell.innerHTML = rowData[fieldName];
            if (index === 6) {
                cell.innerHTML = rowData[fieldName].toUpperCase();
                // If status is approved, change cell color to green
                if (rowData[fieldName].toLowerCase() === 'scheduled') {
                    cell.style.backgroundColor = 'lightblue';
                }
                // If status is rejected, change cell color to red
                else if (rowData[fieldName].toLowerCase() === 'cancelled') {
                    cell.style.backgroundColor = 'lightcoral';
                } else {
                    cell.style.backgroundColor = 'lightgreen';
                }
            }
            // If dateSubmitted, format date
            else if (index === 10) {
                cell.innerHTML = rowData[fieldName].toDate().toLocaleDateString();
            }
            // If visitDate, format date
            else if (index === 4) {
                const date = new Date(rowData[fieldName]);
                cell.innerHTML = date.toLocaleDateString();
            }
        });

        let verifyButton = row.insertCell(11);
        const button1 = document.createElement('button');
        button1.innerText = 'Verify';
        button1.className = 'btn btn-success btn-primary';
        button1.onclick = () => verifyInteraction(id);
        verifyButton.appendChild(button1);

        let rejectButton = row.insertCell(12);
        const button2 = document.createElement('button');
        button2.innerText = 'Reject';
        button2.className = 'btn btn-success btn-danger';
        button2.onclick = () => rejectInteraction(id);
        rejectButton.appendChild(button2);
    });
}

// Upon verfiying an interaction, move it to the verified interactions collection
async function verifyInteraction(docId) {
    alert('Verifying interaction...');
    const docRef = doc(db, "unverifiedInteractions", docId);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        const docData = docSnap.data();
        try {
            await setDoc(doc(db, "verifiedInteractions", docId), docData);
            await deleteDoc(docRef);
            alert('Interaction has been verified');
            window.location.href = 'admin.html';
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error verifying interaction');
        }
        } else {
        console.log("No such document!");
        alert('Error: Document not found');
        }
    } catch (error) {
        console.error("Error getting document: ", error);
        alert('Error: Unable to retrieve the document');
    }
};

// Upon rejecting an interaction, move it to the rejected interactions collection
async function rejectInteraction(docId) {
    alert('Rejecting interaction...');
    const docRef = doc(db, "unverifiedInteractions", docId);
    
    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        const docData = docSnap.data();
        try {
            await setDoc(doc(db, "rejectedInteractions", docId), docData);
            await deleteDoc(docRef);
            alert('Interaction has been rejected');
            window.location.href = 'admin.html';
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error rejecting interaction');
        }
        } else {
        console.log("No such document!");
        alert('Error: Document not found');
        }
    } catch (error) {
        console.error("Error getting document: ", error);
        alert('Error: Unable to retrieve the document');
    }
};

// Loads table when page is loaded
createUnverifiedInteractionsTable();