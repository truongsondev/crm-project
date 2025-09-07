const STATUS_CODE = {
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  AUTHORIZED: 401,
  CONFLIC: 409,
  NOT_FOUND_USER: 406,
  BAD_REQUEST: 400,
};
const REASON_CODE = {
  FORBIDDEN: "Bad request",
  NOT_FOUND: "Data not found",
  AUTHORIZED: "Permission denied",
  CONFLIC: "Data conflict detected",
  NOT_FOUND_USER: "User current doesn't exit",
  BAD_REQUEST: "Request invalid",
};
export class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(message = REASON_CODE.FORBIDDEN, status = STATUS_CODE.FORBIDDEN) {
    super(message, status);
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(message = REASON_CODE.NOT_FOUND, status = STATUS_CODE.NOT_FOUND) {
    super(message, status);
  }
}

export class AuthorizedError extends ErrorResponse {
  constructor(
    message = REASON_CODE.AUTHORIZED,
    status = STATUS_CODE.AUTHORIZED
  ) {
    super(message, status);
  }
}

export class ConflicError extends ErrorResponse {
  constructor(message = REASON_CODE.CONFLIC, status = STATUS_CODE.CONFLIC) {
    super(message, status);
  }
}

export class NotFoundUser extends ErrorResponse {
  constructor(
    message = REASON_CODE.NOT_FOUND_USER,
    status = STATUS_CODE.NOT_FOUND_USER
  ) {
    super(message, status);
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(
    message = REASON_CODE.BAD_REQUEST,
    status = STATUS_CODE.BAD_REQUEST
  ) {
    super(message, status);
  }
}
