import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

//Note: using functional approach to initialize firebase which is different from the v9 firebase SDK in lab06
const app = initializeApp({
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DATABASE,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID
});
const auth = getAuth(app);

// Custom alert from lab06
function create_alert(type, message) {
    var alertArea = document.getElementById('custom-alert');
    if (type == "success") {
        var str_html = "<div class='alert alert-success alert-dismissible fade show' role='alert'><strong>Success! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertArea.innerHTML = str_html;
    } else if (type == "error") {
        var str_html = "<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertArea.innerHTML = str_html;
    }
}

function init() {
    // Login with Email/Password
    var email = document.getElementById('inputEmail');
    var password = document.getElementById('inputPassword');
    var btnLogin = document.getElementById('btnLogin');
    var btnGoogle = document.getElementById('btngoogle');
    var btnSignUp = document.getElementById('btnSignUp');

    btnSignUp.addEventListener('click', function() {
        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                create_alert("success", "Sign up success! Redirecting to the homepage in 2 seconds...");
                document.body.classList.add('page-transition');
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            })
            .catch((error) => {
                const errorMessage = error.message;
                create_alert("error", errorMessage);
            });
    });

    btnLogin.addEventListener('click', function() {
        signInWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                create_alert("success", "Login success! Redirecting to the homepage in 2 seconds...");
                document.body.classList.add('page-transition');
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            })
            .catch((error) => {
                const errorMessage = error.message;
                create_alert("error", errorMessage);
            });
    });

    // GOOGLE SIGN IN
    btnGoogle.addEventListener('click', function() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                create_alert("success", "Login success! Redirecting to the homepage in 2 seconds...");
                document.body.classList.add('page-transition');
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            }).catch((error) => {
            const errorMessage = error.message;
            // The email of the user's account used.
            create_alert("error", errorMessage);
        });

    });


}

window.onload = () => {
    init();
};