const admin = require("firebase-admin");

const serviceAccount = require("../config/serviceAccountKey.json");

const adminFirebaseInit = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = adminFirebaseInit;
