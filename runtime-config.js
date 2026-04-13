// Runtime overrides for auth provider and API base URL.
// API auth is default. Override these at runtime if needed:
// window.KWALA_AUTH_PROVIDER = 'api';
// window.KWALA_API_BASE_URL = 'https://your-container-url';
window.KWALA_AUTH_PROVIDER = 'firebase';
window.KWALA_API_BASE_URL = 'https://kwalapi-229346218844.europe-west1.run.app';

// Firebase config override. Replace values here for another Firebase project.
window.KWALA_FIREBASE_CONFIG = window.KWALA_FIREBASE_CONFIG || {
	apiKey: 'AIzaSyAvNmfxo1fo7zJ2z9-z5d8XQucTqq2ocIo',
	authDomain: 'kwala-dashboard.firebaseapp.com',
	projectId: 'kwala-dashboard',
	storageBucket: 'kwala-dashboard.firebasestorage.app',
	messagingSenderId: '1097546818738',
	appId: '1:1097546818738:web:f3597dcc7cff4e2fc715ab',
	measurementId: 'G-D8XX1F8K3W'
};
