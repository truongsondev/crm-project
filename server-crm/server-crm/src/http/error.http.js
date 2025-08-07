const STATUS_CODE = {
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  AUTHORIZED: 401,
  CONFLIC: 409,
};
const REASON_CODE = {
  FORBIDDEN: "Bad request",
  NOT_FOUND: "Data not found",
  AUTHORIZED: "Permission denied",
  CONFLIC: "Data conflict detected",
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
