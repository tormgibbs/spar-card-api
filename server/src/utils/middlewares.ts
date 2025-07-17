import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "./errors";
import { formatZodErrors } from "./helpers";
import {
	badRequestResponse,
	errorResponse,
	failedValidationResponse,
	notFoundResponse,
	serverErrorResponse,
} from "./http-responses";

export const notFound: RequestHandler = (_request, response, _next) => {
	notFoundResponse(response);
};

export const errorHandler: ErrorRequestHandler = (
	error,
	request,
	response,
	_next,
) => {
	if (error instanceof SyntaxError) {
		badRequestResponse(response, "the request body is not valid JSON");
		return;
	}

	if (error instanceof ZodError) {
		const formattedErrors = formatZodErrors(error);
		failedValidationResponse(response, formattedErrors);
		return;
	}

	if (error instanceof HttpError) {
		errorResponse(response, error.status, error.message);
		return;
	}

	serverErrorResponse(request, response, error);
};
