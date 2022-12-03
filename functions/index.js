/* eslint-disable */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();

exports.onUserStatusChanged = functions.database
  .ref('/users/{uid}')
  .onUpdate(async (change, context) => {
    const eventStatus = change.after.val();
    const userStatusFirestoreRef = firestore.doc(`users/${context.params.uid}`);
    const statusSnapshot = await change.after.ref.once('value');
    const status = statusSnapshot.val();
    if (status.online === 'false') {
      return userStatusFirestoreRef.update({
        online: false,
      });
    }
  });
