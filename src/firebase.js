//Initialise Firebase

import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getStorage} from "firebase/storage";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOBXcP3Ejs0aLNmqt5AOEzW8Q5gQiuUtw",
  authDomain: "chat-da055.firebaseapp.com",
  projectId: "chat-da055",
  storageBucket: "chat-da055.appspot.com",
  messagingSenderId: "221906269261",
  appId: "1:221906269261:web:d2a434be80b36f4b935804",
  measurementId: "G-SQF700T65V"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);