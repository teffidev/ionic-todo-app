// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyCFwzz_MuIuAbxIJgZCKi0U3WfAmqmL3UU",
    authDomain: "ionic-todo-app-1ac5d.firebaseapp.com",
    projectId: "ionic-todo-app-1ac5d",
    storageBucket: "ionic-todo-app-1ac5d.firebasestorage.app",
    messagingSenderId: "163530233116",
    appId: "1:163530233116:web:4f687128dbc33c179496d9",
    measurementId: "G-SRRF2FFGJM"
  }
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
