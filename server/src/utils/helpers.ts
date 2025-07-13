import type { ZodError } from "zod";

export const formatZodErrors = (error: ZodError): Record<string, string> => {
	const errors: Record<string, string> = {};
	
	error.issues.forEach((err) => {
		const path = err.path.join('.');
		errors[path] = err.message;
	});
	
	return errors;
};