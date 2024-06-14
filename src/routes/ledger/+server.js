import { serializeNonPOJOs } from '$lib/utils.js';
import { redirect } from '@sveltejs/kit';
import { fail } from  '@sveltejs/kit';
import { message } from 'sveltekit-superforms';

//to create the ledger
export async function POST({request,locals})
{
    if (!locals.pb.authStore.isValid) {
		redirect (303,"/")
	}
    
    let formData = await request.json();
    const {newLedger} = formData;
    const data = {
        "name":newLedger,
        "owner":locals.user.id,
    }
    //check if the ledger already exists
    try{
        const existingLedgers = await locals.pb.collection('registers').getFullList({
			filter: `owner = '${data.owner}' && name = '${data.name}'`,
		});
        console.log(existingLedgers)
        if (existingLedgers.length >0){
            throw fail(404,{message:'Ledger already exists'})
        }
        //create the new ledger
        const record = await locals.pb.collection('registers').create(data);
    }catch(err){
        console.log(err);
        return new Response(JSON.stringify({message:"Failed to create register"}),
                    {status:400});
    }
    const response={
        message:'Register created successfully',
        register:{newLedger}
    };
    return new Response(
        JSON.stringify({message:'Employee created success'}),
        {status:200})


};

export const GET = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		return new Response('Not authenticated', { status: 401 });
	}

	const userId = locals.user.id;

	try {
		const ledgers = serializeNonPOJOs(
			await locals.pb.collection('registers').getFullList({
				filter: `owner = '${userId}'`,
			})
		);
		return new Response(JSON.stringify(ledgers), { status: 200 });
	} catch (err) {
		console.log("Error:", err);
		return new Response(err.message, { status: err.status });
	}
};
