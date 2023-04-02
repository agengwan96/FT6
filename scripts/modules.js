// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

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
const database = getDatabase();

// Login
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');

// Login Button Event Listener
if (document.getElementById('loginButton') != null) {
  document.getElementById('loginButton').addEventListener('click', (e) => {
    e.preventDefault();
        signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                
                // Update last login  
                update(ref(database, 'users/' + user.uid), {
                    lastLogin: new Date().toLocaleString(),
                });

                // Alert success (remove later)
                alert('Login Successful');

                // Redirect to dashboard
                window.location.href = './pages/dashboard.html';
            })
            .catch((error) => {
                //const errorCode = error.code;
                //const errorMessage = error.message;
                alert('Login Failed');
            });
  });
}

// Get the current user
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    //alert('User is signed in');

    const userRef = ref(database, 'users/' + uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      document.getElementById('userName').innerHTML = data.username;
    });
    
  } else {
    // User is signed out
    //alert('User is not signed in');
  }
});

const adminLink = document.getElementById('adminPanel');

// Check if user is admin
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const userRef = ref(database, 'users/' + uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data.role == 'admin') {
        adminLink.style.display = 'block';
      } else {
        adminLink.style.display = 'none';
      }
    });
  }
});

// Logout Button Event Listener
if (document.getElementById('logoutButton') != null) {
  document.getElementById('logoutButton').addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
      // Sign-out successful.
      alert('Logout Successful');
      window.location.href = '../index.html';
    }).catch((error) => {
      // An error happened.
      alert('Logout Failed');
    });
  });
}

// MOU Upload
let dropArea = document.getElementById('drop-area');

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('highlight')
}

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function uploadFile(file) {
  let url = 'YOUR URL HERE'
  let formData = new FormData()

  formData.append('file', file)

  fetch(url, {
    method: 'POST',
    body: formData
  })
  .then(() => { /* Done. Inform the user */ })
  .catch(() => { /* Error. Inform the user */ })
}

