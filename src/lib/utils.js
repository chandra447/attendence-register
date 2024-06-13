export const employeeObject = {
    mainRoad: {
      employees: generateEmployees(40)
    },
    department: {
      employees: generateEmployees(40)
    }
  };
  
  export const ledgersMap = new Map([
    ["mainRoad", employeeObject.mainRoad],
    ["department", employeeObject.department]
  ]);
  
  export function generateEmployees(count) {
    const employees = [];
    const usedNames = new Set();
    const firstNames = ["John", "Jane", "Alice", "Bob", "Michael", "Emily", "David", "Sarah", "Daniel", "Olivia"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    const statuses = ["Inshop", "Outshop"];
  
    for (let i = 0; i < count; i++) {
      let name = "";
      do {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        name = `${firstName} ${lastName}`;
      } while (usedNames.has(name));
  
      usedNames.add(name);
  
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const present = Math.random() < 0.8; // 80% chance of being present
      const checkIn = present ? Math.random() < 0.9 : false; // 90% chance of checking in if present
      const checkOut = checkIn ? Math.random() < 0.6 : false; // 60% chance of checking out if checked in
  
      employees.push({
        name,
        status,
        present,
        checkIn,
        checkOut
      });
    }
  
    return employees;
  }

const { randomBytes } = await import('node:crypto');

export const serializeNonPOJOs = (obj) => {
	return structuredClone(obj);
};

export const generateUsername = (name) => {
	const id = randomBytes(2).toString('hex');
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
