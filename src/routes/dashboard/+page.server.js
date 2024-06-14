import { serializeNonPOJOs } from '$lib/utils.js';
import { redirect,error } from '@sveltejs/kit';



export const load = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	}

	const userId = locals.user.id;
	const getLedgers = async () => {
		try {
			const ledgers_after = serializeNonPOJOs(
				await locals.pb.collection('registers').getFullList({
					filter: `owner = '${userId}'`,
				})
			);
			return ledgers_after;
		} catch (err) {
			console.log("Error:", err);
			throw error(err.status, err.message);
		}
	};

	const ledgers = await getLedgers();
	return { ledgers };
};


