import { serializeNonPOJOs } from '$lib/utils.js';
import { redirect,error } from '@sveltejs/kit';
import moment from 'moment-timezone';

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
	const getStartDate = async (ledgerid) =>{
		let localUtcStartDay = moment.tz('Asia/Kolkata').startOf('day').utc().toISOString().replace("T"," ");

		try {
			const ledgers = serializeNonPOJOs(
				await locals.pb.collection('StartLedger').getFullList({
					filter: `StartDateTime > "${localUtcStartDay}" && register.id="${ledgerid}"`,
					sort: "-created",
				})
			);
			return ledgers
		} catch (err) {
			console.log("Error:", err);
			return [];
		}
	}

	const ledgers = await getLedgers();
	let startTime = 'None';
	
	if (ledgers.length>0){
	let id = ledgers[0].id;
	
	startTime = await getStartDate(ledgers[0].id)
	}
	return { ledgers,startTime };
};

