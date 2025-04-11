// src/routes/auth/google/login/+server.js
import { redirect, error } from '@sveltejs/kit'; // Import 'error' helper
import { OAuth2Client } from 'google-auth-library';
import { env } from '$env/dynamic/private'; // Use SvelteKit's private env module

export async function GET({ url }) { // url might be useful for 'state' parameter later

    // --- Access Private Environment Variables ---
    const clientId = env.GOOGLE_ADS_CLIENT_ID;
    const clientSecret = env.GOOGLE_ADS_CLIENT_SECRET;
    // Retrieve the exact Redirect URI you configured in Google Cloud Console
    const redirectUri = env.REDIRECT_URI;

    // --- Validate Essential Configuration ---
    // Throw internal server errors if configuration is missing
    if (!clientId) {
        console.error("Missing GOOGLE_CLIENT_ID environment variable.");
        throw error(500, "Authentication configuration error."); // Use error helper
    }
    if (!clientSecret) {
        console.error("Missing GOOGLE_CLIENT_SECRET environment variable.");
        throw error(500, "Authentication configuration error.");
    }
    if (!redirectUri) {
        console.error("Missing GOOGLE_REDIRECT_URI environment variable.");
        throw error(500, "Authentication configuration error.");
    }
    // Developer token is NOT needed for this step.

    // --- NO need to instantiate GoogleAdsApi here ---

    // --- Create OAuth2Client solely for generating the auth URL ---
    const oauth2Client = new OAuth2Client(
        clientId,
        clientSecret,
        redirectUri // Use the configured Redirect URI from .env
    );

    // --- Generate the Google OAuth URL ---
    const scopes = [
        'https://www.googleapis.com/auth/adwords' // Standard Google Ads scope
        // Add other scopes if needed (e.g., profile, email)
        // 'https://www.googleapis.com/auth/userinfo.email',
        // 'https://www.googleapis.com/auth/userinfo.profile',
    ];

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Crucial to get a refresh token
        scope: scopes,
        prompt: 'consent', // Optional: ensures the consent screen is always shown and helps in getting a refresh token on subsequent logins.
        // state: 'YOUR_CSRF_TOKEN' // Recommended: Generate a unique random string, store it in a short-lived cookie/session, and verify it in the callback
    });

    // --- Redirect the user to Google ---
    throw redirect(302, authUrl);
}
