import CryptoJS from 'crypto-js';
import moment from 'moment-timezone';

export const serializeNonPOJOs = (obj) => {
	return structuredClone(obj);
};

export const generateUsername = (name) => {
	const id = CryptoJS.lib.WordArray.random(2).toString();
	return `${name.slice(0, 5)}${id}`;
};


export const validateData = async (formData, schema) => {
	const body = Object.fromEntries(formData);

	try {
		const data = schema.parse(body);

		return {
			formData: data,
			errors: null
		};
	} catch (err) {
    const {fieldErrors: errors} = err.flatten()

		return {
			formData: body,
			errors
		};
	}
};

export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }

  export function expandMerge(data, currentDate) {
    return data.map(emp => {
        let isPresent = false;
        let presentId = '';
        let hasAttendanceRecord = false;

        if (emp.expand && emp.expand.attendance_via_employee) {
            const attendances = emp.expand.attendance_via_employee;
            
            // Find the attendance record for the current date
            const todayAttendance = attendances.find(a => a.date.includes(currentDate));
            if (todayAttendance) {
                hasAttendanceRecord = true;
                isPresent = todayAttendance.present;
                presentId = todayAttendance.id;
            }
        }

        return {
            ...emp,
            present: isPresent,
            presentid: presentId,
            transaction: hasAttendanceRecord ? (isPresent ? 1 : 0) : 0,
            disabledCheckout: !isPresent || !hasAttendanceRecord,
            disabledCheckin: isPresent || !hasAttendanceRecord
        };
    });
}


  export function addLogger(data,loggedData){
	
	return data.map(emp=>{
		let isCheckedOut = false;
        let hasCheckOutRecord = false;
		loggedData = loggedData.map(x=>{
			return {
				...x,
				inTime: x.inTime.replace(" ","T"),
				outTime: x.outTime.replace(" ","T")}
		})
		//find all the logs with inTIme as blank from the loggerData(which is an array)
		let checkedOutData = loggedData.find(x=> x.present===emp.presentid && x.inTime==='');
		let checkedinData = loggedData.filter((x)=> x.present===emp.presentid && x.inTime!=='');
		let empLoggedData = checkedinData;
		


		//console.log the latest object in the array checked sort by obj.inTime
		empLoggedData.sort((a,b)=>moment(a.outTime).diff(moment(b.outTime),"minutes"));
		empLoggedData = empLoggedData.map(log=>{
			return {
				...log,
				duration: moment(log.inTime).diff(moment(log.outTime),"minutes")
			}
		})
		checkedinData.sort((a,b)=>moment(b.inTime).diff(moment(a.inTime),"minutes"));
		let latestCheckin = checkedinData[0];



		if (checkedOutData){
			isCheckedOut = true;
			hasCheckOutRecord = true;
		}
		

		return {
			...emp,
			//disabledcheckout should be true when there is a record or else make this false
			//true=disabled
			//false=enabled
			disabledCheckout: !emp.present? true : hasCheckOutRecord,
			//disabledcheckin should be false if there is a checkedOutData or true if no record found
			disabledCheckin: !isCheckedOut,
			latestCheckoutTime: checkedOutData ? checkedOutData.outTime : (latestCheckin? latestCheckin.outTime : ''),
			latestCheckinTime: latestCheckin ?latestCheckin.inTime : '',
			totalLogs: loggedData.filter((x)=> x.present===emp.presentid).length,
			logData: empLoggedData,
			// 2024-06-23 05:17:31.028Z
			//2024-06-23T15:00:00+10:00 this is what i get when i use format
		}
		
	})

  }