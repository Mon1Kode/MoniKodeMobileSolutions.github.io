// app.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, push } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js"';
import {firebase} from "googleapis/build/src/apis/firebase"; // Import your Firebase configuration
import firebaseConfig from './firebase-config.js'; // Import your Firebase configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Get a reference to the database location where emails will be stored
const emailRef = ref(database, '/test/email');

// Handle form submission
const emailForm = document.getElementById('emailForm');
const emailInput = document.getElementById('emailInput');

emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;

    // Store the email in the database
    push(emailRef, email)
        .then(() => {
            console.log('Email stored successfully:', email);   
            firebase.analytics().logEvent('email_submitted');
        })
        .catch((error) => {
            console.error('Error storing email:', error);
        });
});
