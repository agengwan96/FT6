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
    document.getElementById('loginButton').addEventListener('click', (e) => {
      e.preventDefault();
          signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
              .then((userCredential) => {
                  // Signed in 
                  const user = userCredential.user;
                  
                  // Update last login
                  const lastLogin = new Date().toLocaleString();
  
                  update(ref(database, 'users/' + user.uid), {
                      lastLogin: lastLogin
                  });
  
                  alert('Login Successful');
  
                  window.location.href = './pages/dashboard.html';
              })
              .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  alert('Login Failed');
              });
    });
    


  // Get the current user
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      alert('User is signed in');

      const userRef = ref(database, 'users/' + uid);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        document.getElementById('userName').innerHTML = data.username;
      });
      
    } else {
      // User is signed out
      alert('User is not signed in');
    }
  });

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
  