// ========================================
// LOGIN PAGE - Supports Firebase auth (default) and API auth (optional)
// ========================================

import { AUTH_PROVIDER, API_BASE_URL, buildApiUrl } from './app-config.js';
import {
    auth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from './firebase-config.js';

const AUTH_TOKEN_KEY = 'kwala_api_token';
const AUTH_USER_KEY = 'kwala_api_user';
const AUTH_EXPIRES_KEY = 'kwala_api_expires_at';

function getStoredToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
}

function clearApiAuthState() {
    [localStorage, sessionStorage].forEach((store) => {
        store.removeItem(AUTH_TOKEN_KEY);
        store.removeItem(AUTH_USER_KEY);
        store.removeItem(AUTH_EXPIRES_KEY);
    });
}

function setUserSession(user) {
    const safeUser = user || {};
    const rawName = safeUser.displayName || safeUser.name || '';
    const fallbackName = safeUser.email ? safeUser.email.split('@')[0] : 'User';
    const userName = rawName || fallbackName;
    const userEmail = safeUser.email || '';
    const userUid = safeUser.uid || safeUser.id || '';

    sessionStorage.setItem('userName', userName);
    sessionStorage.setItem('userEmail', userEmail);
    sessionStorage.setItem('userUid', userUid);
}

function mapFirebaseError(code) {
    switch (code) {
        case 'auth/operation-not-allowed':
            return 'Email/Password sign-in is disabled in Firebase Authentication.';
        case 'auth/invalid-api-key':
            return 'Firebase API key is invalid for this project.';
        case 'auth/app-not-authorized':
            return 'This domain is not authorized in Firebase Authentication settings.';
        case 'auth/unauthorized-domain':
            return 'This domain is not authorized in Firebase Authentication settings.';
        case 'auth/invalid-app-credential':
            return 'Firebase app credential is invalid for this project/domain.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
        case 'auth/invalid-login-credentials':
            return 'Invalid email or password.';
        case 'auth/user-disabled':
            return 'This Firebase user is disabled.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Check your connection.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        default:
            return 'Something went wrong. Please try again.';
    }
}

function formatFirebaseError(error) {
    const code = error && error.code ? error.code : '';
    const baseMessage = mapFirebaseError(code);
    return code ? `${baseMessage} (${code})` : baseMessage;
}

async function verifyExistingApiSession() {
    const token = getStoredToken();
    if (!token) {
        return false;
    }

    try {
        const response = await fetch(buildApiUrl('/api/auth/session'), {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            clearApiAuthState();
            return false;
        }

        const payload = await response.json();
        setUserSession(payload.user);
        window.location.href = 'dashboard.html';
        return true;
    } catch (_error) {
        return false;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const rememberMeInput = document.getElementById('rememberMe');
    const authError = document.getElementById('authError');
    const authErrorText = document.getElementById('authErrorText');
    const loginSubmit = document.getElementById('loginSubmit');
    const togglePassword = document.getElementById('togglePassword');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            togglePassword.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    }

    function showError(message) {
        authErrorText.textContent = message;
        authError.classList.add('show');
    }

    function hideError() {
        authError.classList.remove('show');
    }

    let isSubmitting = false;

    if (AUTH_PROVIDER === 'firebase') {
        onAuthStateChanged(auth, async (user) => {
            if (user && !isSubmitting) {
                try {
                    const token = await user.getIdToken();
                    const storage = localStorage.getItem(AUTH_TOKEN_KEY) ? localStorage : sessionStorage;
                    storage.setItem(AUTH_TOKEN_KEY, token);
                } catch (e) {}
                setUserSession(user);
                window.location.href = 'dashboard.html';
            }
        });
    } else if (await verifyExistingApiSession()) {
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showError('Please fill in all fields.');
            return;
        }

        if (!email.includes('@')) {
            showError('Please enter a valid email address.');
            return;
        }

        isSubmitting = true;
        loginSubmit.classList.add('loading');
        loginSubmit.disabled = true;

        try {
            if (AUTH_PROVIDER === 'firebase') {
                const persistenceMode = rememberMeInput && rememberMeInput.checked
                    ? browserLocalPersistence
                    : browserSessionPersistence;
                await setPersistence(auth, persistenceMode);
                const credential = await signInWithEmailAndPassword(auth, email, password);
                
                const token = await credential.user.getIdToken();
                const storage = rememberMeInput && rememberMeInput.checked ? localStorage : sessionStorage;
                storage.setItem(AUTH_TOKEN_KEY, token);

                setUserSession(credential.user);
                window.location.href = 'dashboard.html';
                return;
            }

            const response = await fetch(buildApiUrl('/api/auth/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const payload = await response.json();

            if (!response.ok || !payload.ok) {
                showError(payload.error || 'Invalid email or password.');
                isSubmitting = false;
                loginSubmit.classList.remove('loading');
                loginSubmit.disabled = false;
                return;
            }

            const storage = rememberMeInput && rememberMeInput.checked ? localStorage : sessionStorage;
            storage.setItem(AUTH_TOKEN_KEY, payload.token || '');
            storage.setItem(AUTH_USER_KEY, JSON.stringify(payload.user || {}));
            storage.setItem(AUTH_EXPIRES_KEY, String(payload.expiresAt || ''));

            setUserSession(payload.user);
            window.location.href = 'dashboard.html';
        } catch (error) {
            if (AUTH_PROVIDER === 'firebase') {
                showError(formatFirebaseError(error));
            } else {
                const apiHint = API_BASE_URL || window.location.origin;
                showError(`Could not reach the API server. Current API base: ${apiHint}`);
            }

            isSubmitting = false;
            loginSubmit.classList.remove('loading');
            loginSubmit.disabled = false;
        }
    });
});
