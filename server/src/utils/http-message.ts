const httpMessage = {
  NotFound: "the requested resource was not found",
  InternalServerError:
    "the server encountered a problem and could not process your request",
  InvalidCredentials: "invalid credentials, please try again",
  BadRequest: "the request was invalid or malformed",
  TokenRequired: "a valid token is required to proceed",
  InvalidToken: "the provided token is invalid or has expired",
} as const;

export default httpMessage;
