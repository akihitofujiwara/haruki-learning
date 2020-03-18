import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import 'firebase/auth';

import env from './env';

export const config =  {
  apiKey: env('FIREBASE_API_KEY'),
  authDomain: env('FIREBASE_AUTH_DOMAIN'),
  databaseURL: env('FIREBASE_DATABASE_URL'),
  projectId: env('FIREBASE_PROJECT_ID'),
  storageBucket: env('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('FIREBASE_MESSAGING_SENDER_ID'),
};

firebase.initializeApp(config);

export let functions;

if(env('CLOUD_FUNCTIONS_EMULATOR') === 'true') {
  functions = firebase.functions();
  functions.useFunctionsEmulator('http://localhost:5001');
} else {
  functions = firebase.app().functions('asia-northeast1');
}

export default firebase;
