// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
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

/* Sign up user */
if (document.getElementById('registerSubmitButton') != null) {
  document.getElementById('registerSubmitButton').addEventListener('click', async (e) => {
    e.preventDefault();

    const emailVar = document.getElementById('emailRegisterField').value;
    const passwordVar = document.getElementById('passwordRegisterField').value;
    const usernameVar = document.getElementById('usernameRegisterField').value;

    const mailformat = /^\w+([\.-]?\w+)*@murdoch.edu.au+$/;
    const mailformat2 = /^\w+([\.-]?\w+)*@student.murdoch.edu.au+$/;

    if (!emailVar || !passwordVar) {
      alert('Please enter required fields!');
      return;
    }

    if (!emailVar.match(mailformat) && !emailVar.match(mailformat2)) {
      alert('Invalid email address! Please enter a @murdoch.edu.au or @student.murdoch.edu.au domain email');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailVar, passwordVar);
      const user = userCredential.user;
      await updateProfile(user, { displayName: usernameVar });
      
      await set(ref(database, 'users/' + user.uid), {
        username: usernameVar,
        email: emailVar,
        password: passwordVar,
        role: 'staff'
      });

      alert('User created successfully');
      
      // Redirect to the login screen
      window.location.href = '../index.html';
    } catch (error) {
      alert(error.message);
    }
  });
}

// Reset Password
if (document.getElementById('resetPasswordButton') != null) {
  document.getElementById('resetPasswordButton').addEventListener('click', (e) => {
    e.preventDefault();
    const emailVar = document.getElementById('emailResetField').value;
    sendPasswordResetEmail(auth, emailVar)
    .then(() => {
      // Password reset email sent!
      alert('Password reset email sent!');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      alert(errorMessage);
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

// Gets admin properties
const adminLink = document.getElementById('adminPanel');
const adminLinkLock = document.getElementById('adminPanelLock');

// Check if user is admin
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const userRef = ref(database, 'users/' + uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data.role == 'admin') {
        adminLink.style.display = 'block';
        adminLinkLock.style.display = 'block';
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