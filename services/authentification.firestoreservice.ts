var firebaseui = require("firebaseui");
import firebase from "firebase/app";
import "firebase/firestore";

//service d'authentification de firebase

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start("#firebaseui-auth-container", {
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  // Other config options...
});
