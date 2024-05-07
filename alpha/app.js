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
            addEmailToTesting(email)
        })
        .catch((error) => {
            console.error('Error storing email:', error);
        });
});

async function addEmailToTesting(email) {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'la-passerelle-220fa-firebase-adminsdk-7xyan-347fbbf23e.json',
        scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });

    const androidPublisher = google.androidpublisher({
        version: 'v3',
        auth
    });

    try {
        const response = await androidPublisher.edits.testers.update({
            packageName: 'your.package.name',
            track: 'alpha', // or 'alpha', 'beta', depending on your testing track
            requestBody: {
                testers: {
                    googleGroups: [],
                    googlePlusCommunities: [],
                    emails: [email] // Array of emails to add
                }
            }
        });
        console.log('Email added to testing track:', response.data);
    } catch (error) {
        console.error('Failed to add email:', error);
    }
}
