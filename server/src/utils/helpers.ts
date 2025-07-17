import type { ZodError } from "zod";

export const formatZodErrors = (error: ZodError): Record<string, string> => {
  return error.issues.reduce(
		(acc, issue) => {
			const field = issue.path.join('.')
			acc[field] = issue.message
			return acc
		},
		{} as Record<string, string>,
	)
};
