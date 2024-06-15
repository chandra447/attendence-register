import { json } from "@sveltejs/kit";

export async function GET({ url, locals }) {
    const register = url.searchParams.get('register');

    if (!register) {
        return json({ message: 'Register parameter is required' }, { status: 400 });
    }


    try {
        // Query to fetch employees based on the register name
        const employees = await locals.pb.collection('employees').getFullList({
            filter: `register = "${register}"`
        });
       
        return json(employees, { status: 200 });
    } catch (error) {
        return json({ message: error.message }, { status: 400 });
    }
}