const functions = require('firebase-functions');
const os = require("os");
const path = require("path");
const cors = require("cors")({ origin: true });
const fs = require("fs");
const gcs = require('@google-cloud/storage')();
const keccak256 = require('js-sha3').keccak256;

const bucketName = 'chattr-mru-poc.appspot.com'

// Simplified mock of swarm upload endpoint. This endpoint will just return the hash of the file and
// persist the file to a google cloud storage bucket with the has as the file name.
exports.upload = functions.https.onRequest((req, res) => {
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
    fs.writeFile(filepath, JSON.stringify(req.body), (err) => {
      if (err) {
        res.status(500).json({
          error: err
        });
      }

      uploadData = { file: filepath, type: req.get('content-type') };
      const bucket = gcs.bucket(bucketName);

      bucket.upload(filepath, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        // gzip: true,
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
    })
  });
});


exports.download = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "GET") {
      return res.status(500).json({
        message: "ERR 500: Method Not Allowed"
      });
    }
    const srcFilename = req.query.address;
    const destFilename = path.join(os.tmpdir(), srcFilename);

    const options = {
      // The path to which the file should be downloaded, e.g. "./file.txt"
      destination: destFilename,
    };

    // Downloads the file
    gcs
      .bucket(bucketName)
      .file(srcFilename)
      .download(options)
      .then(() => {
        fs.readFile(destFilename, function (err, data) {
          if (err) {
            res.status(500).json({
              error: err
            });
          }
          console.log('data: ', data.toString());
          res.status(200).send(data.toString());
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

