import { serializeNonPOJOs } from '$lib/utils.js';
import { redirect,error } from '@sveltejs/kit';



export const load = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	}

	const userId = locals.user.id;
	const isAdmin = locals.user.isAdmin;
	let ledgers_after = {};
	const getLedgers = async () => {
		try {
			if (isAdmin){

			
				 ledgers_after = serializeNonPOJOs(
					await locals.pb.collection('registers').getFullList({
						filter: `owner = '${userId}'`,
					})
				);
				return ledgers_after;
			}else{
					//get the ledger which the non-admin belongs to
					let ledgerBelonging = serializeNonPOJOs(
						await locals.pb.collection('Employees').getFullList({
							filter: `Name='${locals.user.username}'`
						})
					);
				
				
					const registerIds = ledgerBelonging.map(employee => employee.register);
					let ledgers_after = serializeNonPOJOs(
						await locals.pb.collection('registers').getFullList({
							filter: `id = "${registerIds.join('" || register.id = "')}" && owner='${locals.user.Owner}'`,
						})
					);
	
					return ledgers_after;
					
			}
			
		} catch (err) {
			console.log("Error:", err);
			throw error(err.status, err.message);
		}
	};

	const ledgers = await getLedgers();
	return { ledgers };
};


