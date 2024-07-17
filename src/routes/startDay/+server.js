import { serializeNonPOJOs } from '$lib/utils.js';
import { json, redirect } from '@sveltejs/kit';
import { fail } from  '@sveltejs/kit';
import moment from 'moment-timezone';


//to create the ledger
export async function POST({request,locals})
{
    if (!locals.pb.authStore.isValid) {
		redirect (303,"/")
	}
    
    let formData = await request.json();
    const {newLedger} = formData;
    
    //check if the ledger already exists
    try{
        
        //create the startdate for ledger
        const record = await locals.pb.collection('StartLedger').create(formData);
    }catch(err){
        console.log(err);
        return new Response(JSON.stringify({message:"Failed to create register"}),
                    {status:400});
    }
    const response={
        message:'Started Succcessfully',
        register:{newLedger}
    };
    return new Response(
        JSON.stringify({message:'Unable to start'}),
        {status:200})


};


//to get the list of attendance
export const GET = async ({ url,locals }) => {
    const register = url.searchParams.get('register');
	if (!locals.pb.authStore.isValid) {
		return new Response('Not authenticated', { status: 401 });
	}

	const userId = locals.user.id;
    //local start of the day to utc
    let localUtcStartDay = moment.tz('Asia/Kolkata').startOf('day').utc().toISOString().replace("T"," ");
    

	try {
		const ledgers = serializeNonPOJOs(
			await locals.pb.collection('StartLedger').getFullList({
				filter: `StartDateTime > "${localUtcStartDay}" && register.id="${register}"`,
                sort: "-created",
			})
		);
		return new Response(JSON.stringify(ledgers), { status: 200 });
	} catch (err) {
		console.log("Error:", err);
		return new Response(err.message, { status: err.status });
	}
};
