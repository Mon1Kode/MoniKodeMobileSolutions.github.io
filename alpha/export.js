const express = require('express');
const app = express();
const admin = require('firebase-admin');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Firebase admin initialization
const serviceAccount = require('./la-passerelle-220fa-firebase-adminsdk-7xyan-347fbbf23e.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://la-passerelle-220fa-default-rtdb.europe-west1.firebasedatabase.app'
});

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/export.html');
});

// Fetch all emails and write to CSV
app.get('/export-emails', async (req, res) => {
    try {
        const emails = await fetchAllEmails();
        if (emails.length > 0) {
            await writeEmailsToCsv(emails);
            res.json({ message: 'Emails exported successfully.' });
        } else {
            res.json({ message: 'No emails found.' });
        }
    } catch (error) {
        console.error('Failed to export emails:', error);
        res.status(500).json({ message: 'Failed to export emails.' });
    }
});

async function fetchAllEmails() {
    const db = admin.database();
    const ref = db.ref('test').child('email'); // Adjust this path based on your Firebase data structure
    const snapshot = await ref.once('value');
    console.log(snapshot.val());
    const users = snapshot.val();
    const emails = [];
    for (let userId in users) {
        console.log(users[userId]);
        if (users.hasOwnProperty(userId)) {
            emails.push(users[userId]); // Make sure this matches your data structure
        }
    }
    return emails;
}

async function writeEmailsToCsv(emails) {
    const csvWriter = createCsvWriter({
        path: './out/emails.csv',
        header: [{id: 'email'}]
    });

    const records = emails.map(email => ({ email }));
    await csvWriter.writeRecords(records);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
