/** @type {import('./$types').RequestHandler} */
export async function POST({ request,locals }) 
{	let formData = await request.json();	
 
    const {password_exclude,...supervisor} = formData;
    formData['passwordConfirm'] = formData.password;
    formData['isAdmin'] = false;
    formData['Owner'] = locals.user.id;
    if (formData.isSupervisor){
      try{
        // Check if the user exists
          const existingUsers = await locals.pb.collection('users').getFullList({
                filter: `username = "${formData.username}" && Owner="${locals.user.id}"`
          });
          if (existingUsers.length>0){
            return new Response(JSON.stringify({message:"User "+ formData.username +" already exists"}),
            {status:400});
          };
          const record =  await locals.pb.collection('users').create(formData);
        

      }catch(err){
            console.log(err);

            return new Response(JSON.stringify({message:err.response.message}),
                        {status:400});
      }
    }
      //create the employee record with supervisor=true or false
      try{

          //check if the employee exists
          const existingEmployees = await locals.pb.collection('Employees').getFullList({
              filter: `Name = '${formData.username}'`
          })

          if (existingEmployees.length>0){
            return new Response(JSON.stringify({message:"Employee: "+ formData.username +"  already exists"}),
                        {status:400});
          }
          supervisor.Name = supervisor.username;
          delete supervisor.username;
         
        const supervisor_record = await locals.pb.collection('Employees').create(supervisor);
      
      }catch(err){
          console.log(err)
          return new Response(JSON.stringify({message:"Failed to create sueprvisor but user created"}),
          {status:400});
      }

    const response = {
        message: 'Employee created successfully',
        employee: {
          name:formData.username,
        }
      };
    
      return new Response(
        JSON.stringify({response}),
        {status:200})
    };
