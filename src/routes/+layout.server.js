import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

export const load = ({ locals,cookies,url }) => {
	if (locals.user) {
		
		return {
			user: locals.user
		};
	}

	return {
		user: undefined
	};
};
