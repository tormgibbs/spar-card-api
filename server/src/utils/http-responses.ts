import type { Request, Response } from "express";
import httpMessage from "./http-message";
import httpStatus from "./http-status";

export const errorResponse = (
	response: Response,
	statusCode: number,
	message?: any,
) => {
	response.status(statusCode).json({
		success: false,
		error: message,
	});
};

export const serverErrorResponse = (
	request: Request,
	response: Response,
	error: Error,
) => {
	console.log(
		{
			requestUrl: request.url,
			requestMethod: request.method,
			requestBody: request.body,
		},
		error,
	);
	errorResponse(
		response,
		500,
		"the server encountered a problem and could not process your request",
	);
};

export const notFoundResponse = (response: Response) => {
	errorResponse(response, httpStatus.NotFound, httpMessage.NotFound);
};

export const methodNotAllowedResponse = (response: Response) => {
	errorResponse(response, 405, "the requested method is not allowed");
};

export const badRequestResponse = <T>(response: Response, error: T) => {
	errorResponse(response, 400, error);
};

export const failedValidationResponse = (
	response: Response,
	errors: Record<string, string>,
) => {
	errorResponse(response, 422, errors);
};

export const invalidCredentialsResponse = (response: Response) => {
	errorResponse(response, 401, "invalid credentials, please try again");
};

export const invalidAuthenticationTokenResponse = (response: Response) => {
	response.setHeader("WWW-Authenticate", 'Basic realm="Restricted"');
	errorResponse(response, 401, "invalid or missing authentication token");
};

export const authenticationRequiredResponse = (response: Response) => {
	errorResponse(
		response,
		401,
		"you must be authenticated to access this resource.",
	);
};

export const inactiveAccountResponse = (response: Response) => {
	errorResponse(
		response,
		403,
		"you must activate your account to access this resource",
	);
};

export const notPermittedResponse = (response: Response, message?: string) => {
	const errorMessage =
		message ?? "you don't have permission to access this resource";
	errorResponse(response, 403, errorMessage);
};
