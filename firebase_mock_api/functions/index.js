const functions = require('firebase-functions');
const os = require("os");
const path = require("path");
const cors = require("cors")({ origin: true });
const fs = require("fs");
const gcs = require('@google-cloud/storage')();
const keccak256 = require('js-sha3').keccak256;


// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});


// Simplified mock of swarm upload endpoint. This endpoint will just return the hash of the file and
// persist the file to a google cloud storage bucket with the has as the file name.
exports.uploadFile = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(500).json({
        message: "ERR 500: Method Not Allowed"
      });
    }

    if (req.get('content-type') !== 'application/json') {
      return res.status(500).json({
        message: "ERR 500: content-type Not Allowed"
      });
    }

    const filename = keccak256(JSON.stringify(req.body));
    const filepath = path.join(os.tmpdir(), filename);
    fs.writeFile(filepath, req.body);

    uploadData = { file: filepath, type: req.get('content-type') };
    const bucket = gcs.bucket("chattr-mru-poc.appspot.com");

    bucket.upload(filepath, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
        metadata: {
          contentType: uploadData.type
        },
      },
    })
      .then(() => {
        res.status(200).json({
          message: "Success",
          address: filename
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});
