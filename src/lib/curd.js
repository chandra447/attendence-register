import moment from "moment-timezone";
//create the today
export const currentpersistedDate = moment.tz('Asia/Kolkata').format('YYYY-MM-DD');
export async function updateAttendance(data) {
    try {
      const response = await fetch('/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response
      
    } catch (error) {
      console.error('Error updating attendance record:', error);
      throw error;
    }
  }
export async function resetAttendance(data){
  try{
    const response = await fetch('/employees',{
      method:'PATCH',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response
  }catch(error){
    console.error('Error when patching the record: ',error);
    throw error;
  }
}
  export async function getEmployeesInterval(data) {
    
    try {
        const response = await fetch(`/employees?interval=${data.interval}&register=${data.register}&inputDate=${data.retrieveDate}`, {
            method: 'GET'
        });

        if (response.ok) {
            const employees = await response.json();
        
            return employees;
        } else {
            const error = await response.json();
            console.error('Error fetching employees:', error.message);
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error in getEmployeesInterval:', error);
        throw error;
    }
}


export async function deleteEmployees(data) {
  try {
    const response = await fetch('/employees', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response
    
  } catch (error) {
    console.error('Error updating attendance record:', error);
    throw error;
  }
}