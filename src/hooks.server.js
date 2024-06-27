import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';


export const handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (event.locals.pb.authStore.isValid) {
		await event.locals.pb.collection('users').authRefresh();
		event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
		
		// console.log(event.locals.user)
	} else {
		event.locals.user = undefined;
	}

	const response = await resolve(event);

	//TODO: secure before deployment
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

	

	return response;
};

export const handleFetch = ({ event, request, fetch }) => {
    request.headers.set('cookie', event.request.headers.get('cookie'));
    return fetch(request);
};

// This function will run before each request
export function handleLoad({ event, resolve }) {
    if (event.url.pathname === '/') {
        if (event.locals.pb?.authStore?.isValid) {
            throw redirect(303, '/dashboard');
        }
    }
    return resolve(event);
}