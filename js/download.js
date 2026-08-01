/**
 * Kwala Mobile App Download & OS Routing Logic
 * Automatically detects iOS vs Android and routes user to the correct store.
 */

const APP_STORE_URL = 'https://apps.apple.com/ma/app/kwala/id6760371031';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.kwala.app';

document.addEventListener('DOMContentLoaded', () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);

    const routingMsg = document.getElementById('routingStatusMsg');
    const playStoreLink = document.getElementById('playStoreLink');
    const appStoreLink = document.getElementById('appStoreLink');

    if (isIOS) {
        if (routingMsg) {
            routingMsg.innerHTML = '✨ <strong>iOS Device Detected</strong><br>Routing you to the Apple App Store...';
        }
        if (playStoreLink) playStoreLink.style.display = 'none';
        if (appStoreLink) {
            appStoreLink.href = APP_STORE_URL;
            appStoreLink.style.display = 'block';
        }
        // Auto-redirect after short delay
        setTimeout(() => {
            window.location.href = APP_STORE_URL;
        }, 1200);

    } else if (isAndroid) {
        if (routingMsg) {
            routingMsg.innerHTML = '🚀 <strong>Android Device Detected</strong><br>Routing you to the Google Play Store...';
        }
        if (appStoreLink) appStoreLink.style.display = 'none';
        if (playStoreLink) {
            playStoreLink.href = PLAY_STORE_URL;
            playStoreLink.style.display = 'block';
        }
        // Auto-redirect after short delay
        setTimeout(() => {
            window.location.href = PLAY_STORE_URL;
        }, 1200);

    } else {
        if (routingMsg) {
            routingMsg.textContent = 'Select your device store below to download Kwala:';
        }
        if (playStoreLink) {
            playStoreLink.href = PLAY_STORE_URL;
            playStoreLink.style.display = 'block';
        }
        if (appStoreLink) {
            appStoreLink.href = APP_STORE_URL;
            appStoreLink.style.display = 'block';
        }
    }
});
