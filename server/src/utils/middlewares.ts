import type { ErrorRequestHandler, RequestHandler } from "express";
import {
    errorResponse,
  failedValidationResponse,
  notFoundResponse,
  serverErrorResponse,
} from "./http-responses";
import { ZodError } from "zod";
import { formatZodErrors } from "./helpers";
import { HttpError } from "./errors";

export const notFound: RequestHandler = (_request, response, _next) => {
  notFoundResponse(response);
};

export const errorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  _next,
) => {
  if (error instanceof ZodError) {
    const formattedErrors = formatZodErrors(error);
    failedValidationResponse(response, formattedErrors);
    return;
  }

  if (error instanceof HttpError) {
    errorResponse(response, error.status, error.message);
    return 
  }
  
  serverErrorResponse(request, response, error);
};
