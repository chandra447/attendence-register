import { json } from '@sveltejs/kit';
/** @type {import('./$types').RequestHandler} */
export async function POST({ request,locals }) 
{	let formData = await request.json();	
    console.log(formData)
    const {name,password} = formData;
    formData['passwordConfirm'] = formData.password;
    formData['isAdmin'] = false;
    try{
       const record =  await locals.pb.collection('users').create(formData);
       console.log(record);

    }catch(err){
        console.log(err);
        return new Response(JSON.stringify({message:"Failed to create"}),
                    {status:400});
    }
    const response = {
        message: 'Employee created successfully',
        employee: {
          name,
          password
        }
      };
    
      return new Response(
        JSON.stringify({message:'Employee created success'}),
        {status:200})
    };
