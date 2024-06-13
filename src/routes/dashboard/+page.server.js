import { redirect } from '@sveltejs/kit';
import { parse } from 'cookie';

export const load = ({ locals, }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	};

};

