// src/routes/auth/google/callback/+server.js
import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import { env } from '$env/dynamic/private';
// Assume you have DB functions like 'findOrCreateUser' and 'storeUserTokens'
// import { findOrCreateUser, storeUserTokens } from '$lib/server/db';
// Assume you have session functions like 'createSession'
// import { createSession } from '$lib/server/session';

export async function GET({ url, cookies }) {
    const code = url.searchParams.get('code');
    // Optional: Validate state parameter here if you used one

    if (!code) {
        // Handle error: User denied access or something went wrong
        throw redirect(302, '/login?error=google_auth_failed');
    }

    const oauth2Client = new OAuth2Client(
        env.GOOGLE_CLIENT_ID,
        env.GOOGLE_CLIENT_SECRET,
        env.GOOGLE_REDIRECT_URI
    );

    try {
        const { tokens } = await oauth2Client.getToken(code);
        const { access_token, refresh_token, expiry_date } = tokens;

        if (!refresh_token) {
            // This can happen if the user has already granted offline access
            // and you didn't use prompt: 'consent'. You might need to fetch
            // the refresh token stored previously or handle this case.
            console.warn('Refresh token not received. User might have already granted permission.');
            // You might still get an access_token here.
        }

        // 1. Get user profile info from Google (optional but recommended)
        //    Use the access_token to call Google People API or userinfo endpoint
        //    const loginTicket = await oauth2Client.verifyIdToken({ idToken: tokens.id_token, audience: env.GOOGLE_CLIENT_ID });
        //    const payload = loginTicket.getPayload();
        //    const googleUserId = payload['sub'];
        //    const email = payload['email'];
        //    const name = payload['name'];

        // 2. Find or create the user in your database based on Google User ID or email
        // const user = await findOrCreateUser({ googleId: googleUserId, email, name });

        // 3. *** Store tokens securely ***
        //    Associate refresh_token (and potentially access_token/expiry) with your user record
        // await storeUserTokens(user.id, {
        //     accessToken: access_token,
        //     refreshToken: refresh_token, // Store this very securely!
        //     expiryDate: expiry_date
        // });

        // 4. Create a session for the user in your SvelteKit app
        // await createSession(cookies, user.id); // Example using cookies

        // 5. Redirect to a logged-in area
        throw redirect(302, '/dashboard');

    } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        throw redirect(302, '/login?error=token_exchange_failed');
    }
}
