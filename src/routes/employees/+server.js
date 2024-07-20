import { fail, json } from "@sveltejs/kit";
import moment from "moment-timezone";
import { expandMerge,addLogger } from "$lib/utils.js";


export async function GET({url, locals}) {
    const register = url.searchParams.get('register');
    const interval = url.searchParams.get('interval') ;
    const filterDate = url.searchParams.get('inputDate');
    
        //todo
        //filter based on the date provided instead of the current date
    let inputDate = moment.tz(filterDate,'Asia/Kolkata');
   
    let now = moment.tz('Asia/Kolkata');
   
        inputDate.hour(now.hour());
        inputDate.minute(now.minute());
        inputDate.second(now.second());
        inputDate.millisecond(now.millisecond());
    let newDate = inputDate.utc().toISOString().replace("T"," ")
    
    try {
        let tempEmployees = [];
        let expand = 'attendance_via_employee.employee,attendance_via_present';
        // let currentDate = new Date().toISOString().replace("T", " ");
       
        //local start of the day to utc
        let localUtcStartDay = inputDate.startOf('day').utc().toISOString().replace("T"," ");

        

        if (interval && interval!=='10000') {
            let fiveMinuteAgo = moment(newDate.replace(" ","T")).subtract("minute",5).utc().toISOString().replace("T"," ");
            
            let intervalFilter = `register="${register}" && attendance_via_employee.date>="${fiveMinuteAgo}"
                                 && attendance_via_employee.date<="${newDate}"`;
            tempEmployees = await locals.pb.collection('employees').getFullList({
                filter: intervalFilter,
                expand: expand
            });
            
        } else {
            let filter = `register="${register}" && attendance_via_employee.date?>="${localUtcStartDay}"`;
            tempEmployees = await locals.pb.collection('employees').getFullList({
                filter: filter,
                expand: 'attendance_via_employee',
            });
           
        }
        
        // Get the list of all employees
        let employees = await locals.pb.collection('employees').getFullList({
            filter: `register="${register}"`,
            expand: 'attendance_via_employee,Logger_via_present'
        });
        //get all the loggeer details in the descending order
        let logger = await locals.pb.collection('Logger').getFullList({
            filter: `created>="${localUtcStartDay}"`,
            sort: "-created"
        });
    
        employees = employees.map(emp => {
            const findEmployee = tempEmployees.find(x => x.id === emp.id);
            return findEmployee || emp;
        });
   
        employees = expandMerge(employees,newDate.split(" ")[0]);
        if (logger.length>0){
        employees = addLogger(employees,logger);
        }
       
        return json(employees, {status: 200});
    } catch(error) {
        console.log('Error when fetching the employees:', error);
        return json({ message: error.message || 'An error occurred while fetching employees' }, { status: 500 });
    }
}

export async function POST({request,locals}) {
    const formData = await request.json();
    const currentDate = moment.tz('Asia/Kolkata').utc().toISOString().replace("T"," ");
    const localUtcStartDay = moment.tz('Asia/Kolkata').startOf('day').utc().toISOString().replace("T"," ");

    let{todo, Name,...data} = formData;

 
    switch (todo){
        case 'attendance':
            try{
                data = {
                    ...data,
                    date:currentDate,
                };
                // check the attendance record already exists
                const checkAttendance = await locals.pb.collection('attendance').getFullList({
                    filter: `employee="${data.employee}" && date?>="${localUtcStartDay}"`
                })
                
                if (checkAttendance.length===0){
                    const response = await locals.pb.collection('attendance').create(data)
                    return new Response(JSON.stringify({message:"Attendance Updated "+ formData.Name }),
                    {status:200});
                }
                return new Response(JSON.stringify({message:"Attendance Updated "+ formData.Name }),
                {status:200});
            }catch(error){
                console.log('Error updating the attendance record: ',error);
                throw fail(404,{message:error.message});
            }
        case 'createFullRecord':
            data = {
                ...data,
                inTime:currentDate,
            };
            try{
                const response = await locals.pb.collection('Logger').create(data)
                return new Response(JSON.stringify({message:"Created path log"}),{status:200});
                
            }catch(error){
                console.log('Error updating the attendance record: ',error);
                throw fail(404,{message:error.message});
            }
        case 'leave':
            try{
                data = {
                    ...data,
                    
                };
                // collection('Logger').update(record['id'],updatedData)
                let leaveResponse = await locals.pb.collection("attendance").update(data['id'],data)
                console.log(leaveResponse)
                return new Response(JSON.stringify({message:"Marked left "}),{status:200});
                
                }catch(error){
                    console.log('Error when checking-in',error.message);
                    throw fail(404,{message:error.message});
            }
            
        case 'checkout':
            try{
                data = {
                    ...data,
                    outTime: currentDate
                }
                //check if an open checkout record exists for the presentid
                let checkoutrecords = await locals.pb.collection('Logger').getFullList({
                    filter: `present="${data.present}" && outTime>="${localUtcStartDay}" && inTime=""`,
                })
                if(checkoutrecords.length==0){
                let response = await locals.pb.collection('Logger').create(data);}
                else{throw fail(404,{message:'Checkin Failed already exists'});}
           
                return new Response(JSON.stringify({message:"Checked out "+ formData.Name }),
                {status:200});
            }
            catch(error){
                console.log('Error when checking out',error.message);
                throw fail(404,{message:error.message});
            }
        case 'checkin':
            try{
                
                //get the latest checkout record for the presentid
                let checkedoutRecords = await locals.pb.collection('Logger').getFullList({
                    filter: `present="${data.present}" && (inTime="" || inTime=null) && outTime>="${localUtcStartDay}"`,
                    sort: '-created'
                })
                
                if(checkedoutRecords.length>0) {
                    let record = checkedoutRecords[0];
                    let updatedData = {
                        ...record,
                        inTime: currentDate
                    }
                    let response = await locals.pb.collection('Logger').update(record['id'],updatedData);
                    return new Response(JSON.stringify({message:"Checked-in "+formData.Name}),{status:200});
                }
                }catch(error){
                    console.log('Error when checking-in',error.message);
                    throw fail(404,{message:error.message});
            }
        

        default:
            console.log('Todo not provided')
            throw fail(404,{message:error.message});
    }
}

export async function DELETE({locals,request}){
    let employees = await request.json();

    try{
        let response = await locals.pb.collection('employees').delete(employees);

    }catch(error){
        console.log('Error when deleting employees',error.message);
        throw fail(404,{message:error.message})
    }

    return new Response(JSON.stringify({message:'Deleted records'}),{status:200});
}



// ... (keep all existing imports and functions)

export async function PATCH({ request, locals }) {
    try {
        const { id, ...updateData } = await request.json();
        
        if (!id) {
            return json({ message: 'Attendance ID is required' }, { status: 400 });
        }
        let updatedRecord;
        if (updateData.present===false){
            const updatedRecord = await locals.pb.collection('attendance').delete(id)
        }else{

        // Update the record directly without fetching first
        const updatedRecord = await locals.pb.collection('attendance').update(id, updateData);
        }

        return json({
            message: "Attendance record updated successfully",
            data: updatedRecord
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating the attendance record:', error);
        
        // Check if the error is due to record not found
        if (error.status === 404) {
            return json({ message: 'Attendance record not found' }, { status: 404 });
        }
        
        return json({ 
            message: error.message || 'An error occurred while updating the attendance record'
        }, { status: 500 });
    }
}

