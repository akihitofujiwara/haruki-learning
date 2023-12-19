const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const { get, range } = require('lodash');
const { addSeconds, } = require('date-fns');
const numeral = require('numeral');

const { getDocumentData, getCollectionData, batch } = require('./lib/firebase');

firebaseAdmin.initializeApp();
const db = firebaseAdmin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//
exports.migrate = functions.region('asia-northeast1').runWith({ timeoutSeconds: 540 }).https.onRequest(async (req, res) => {
  /*
  await batch(db, range(1, 21), (batch, n) => {
    batch.set(db.collection('missions').doc(), {
      body: `くもんG${n * 10}`,
      point: n === 10 ? 300 : n === 20 ? 500 : 150,
      image: null,
      status: 'initial',
      createdAt: addSeconds(new Date(), n + 200),
      updatedAt: new Date(),
    });
  });
  */

  /*
  const missions = await getCollectionData(db.collection('missions').orderBy('createdAt'));
  await batch(db,
    missions.filter(_ => _.body.startsWith('くもんG') && numeral(_.body).value() <= 110),
    (batch, _) => batch.update(_.ref, { status: 'completed', updatedAt: new Date(), })
  );
  */

  const gifts = await getCollectionData(db.collection('gifts'));
  await batch(db, gifts, (batch, _) => batch.update(_.ref, { status: 'taked', }));

  hoge();
});
