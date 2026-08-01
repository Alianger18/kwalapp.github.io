import { getApp, getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js';
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';

const defaultFirebaseConfig = {
    apiKey: 'AIzaSyAvNmfxo1fo7zJ2z9-z5d8XQucTqq2ocIo',
    authDomain: 'kwala-dashboard.firebaseapp.com',
    projectId: 'kwala-dashboard',
    storageBucket: 'kwala-dashboard.firebasestorage.app',
    messagingSenderId: '1097546818738',
    appId: '1:1097546818738:web:f3597dcc7cff4e2fc715ab',
    measurementId: 'G-D8XX1F8K3W'
};

const runtimeFirebaseConfig =
    typeof window !== 'undefined' && window.KWALA_FIREBASE_CONFIG
        ? window.KWALA_FIREBASE_CONFIG
        : null;

const firebaseConfig = runtimeFirebaseConfig || defaultFirebaseConfig;

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

let analytics = null;
if (typeof window !== 'undefined') {
    try {
        analytics = getAnalytics(app);
    } catch (_error) {
        analytics = null;
    }
}

export {
    app,
    auth,
    analytics,
    firebaseConfig,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
};