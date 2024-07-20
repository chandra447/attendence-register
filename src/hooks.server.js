import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
    event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);
    
    // Load the auth store from the cookie
    const cookie = event.request.headers.get('cookie') || '';
    event.locals.pb.authStore.loadFromCookie(cookie);

    try {
        if (event.locals.pb.authStore.isValid) {
            await event.locals.pb.collection('users').authRefresh();
            event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
            
            // Redirect to dashboard if user is authenticated and trying to access the login page
            if (event.url.pathname === '/') {
                throw redirect(303, '/dashboard');
            }
        } else {
            event.locals.user = undefined;
            
            // Redirect to login page if user is not authenticated and trying to access protected routes
            if (event.url.pathname.startsWith('/dashboard')) {
                throw redirect(303, '/');
            }
        }
    } catch (err) {
        if (err.status === 303) {
            throw err; // Rethrow redirect
        }
        console.error('Auth error:', err);
        event.locals.pb.authStore.clear();
        event.locals.user = undefined;
    }

    const response = await resolve(event);

    // Always set the cookie, even if it's to clear it
    response.headers.set(
        'set-cookie',
        event.locals.pb.authStore.exportToCookie({
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            httpOnly: true,
            path: '/'
        })
    );

    return response;
};