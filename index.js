const functions = require('firebase-functions');
const express = require('express');
const messagesRouter = require('./routers/messages/route');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const app = express();
app.use('/', messagesRouter);

exports.api = functions
    .region('asia-northeast1')
    .https
    .onRequest(app);