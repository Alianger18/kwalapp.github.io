const rawProvider = (window.KWALA_AUTH_PROVIDER || 'firebase').toString().trim().toLowerCase();

export const AUTH_PROVIDER = rawProvider === 'api' ? 'api' : 'firebase';

function trimTrailingSlashes(value) {
    return value.replace(/\/+$/, '');
}

const rawBaseUrl = (window.KWALA_API_BASE_URL || '').toString().trim();
export const API_BASE_URL = trimTrailingSlashes(rawBaseUrl);

export function buildApiUrl(path) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}
