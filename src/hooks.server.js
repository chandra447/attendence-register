import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from '$lib/utils';

export const handle = async ({ event, resolve }) => {
	const url = 'https://extra-luck.pockethost.io/'
	// 'http://localhost:8090'
	event.locals.pb = new PocketBase(url);
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