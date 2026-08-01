// ========================================
// AUTH GUARD - Supports Firebase auth (default) and API auth (optional)
// ========================================

import { AUTH_PROVIDER, buildApiUrl } from './app-config.js';
import { auth, onAuthStateChanged, signOut } from './firebase-config.js';

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

function clearUserSession() {
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userUid');
}

function redirectToLogin() {
    window.location.href = 'login.html';
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

function wireLogoutLinks(handler) {
    document.querySelectorAll('.sidebar-login').forEach((link) => {
        link.textContent = 'Logout';
        link.href = '#';

        if (link.dataset.logoutBound === '1') {
            return;
        }

        link.dataset.logoutBound = '1';
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                await handler();
            }
        });
    });
}

async function apiLogout() {
    const token = getStoredToken();

    try {
        if (token) {
            await fetch(buildApiUrl('/api/auth/logout'), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
    } catch (_error) {
        // Ignore network errors and always clear local auth state
    }

    clearApiAuthState();
    clearUserSession();
    redirectToLogin();
}

async function protectPageWithApi() {
    const token = getStoredToken();

    if (!token) {
        redirectToLogin();
        return;
    }

    try {
        const response = await fetch(buildApiUrl('/api/auth/session'), {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            clearApiAuthState();
            clearUserSession();
            redirectToLogin();
            return;
        }

        const payload = await response.json();
        setUserSession(payload.user);
        wireLogoutLinks(apiLogout);
    } catch (_error) {
        clearApiAuthState();
        clearUserSession();
        redirectToLogin();
    }
}

function protectPageWithFirebase() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            redirectToLogin();
            return;
        }

        setUserSession(user);
        wireLogoutLinks(async () => {
            await signOut(auth);
            clearUserSession();
            redirectToLogin();
        });
    });
}

if (AUTH_PROVIDER === 'api') {
    protectPageWithApi();
} else {
    protectPageWithFirebase();
}
