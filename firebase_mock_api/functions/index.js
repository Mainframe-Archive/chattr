const functions = require('firebase-functions');


// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});
