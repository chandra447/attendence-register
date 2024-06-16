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

export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }
  