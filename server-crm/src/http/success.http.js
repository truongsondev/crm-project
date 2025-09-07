const STATUS_CODE = {
  OKE: 200,
  CREATE: 201,
};

const REASON_CODE = {
  OKE: "Success",
  CREATE: "Create success",
};
export class SuccessResponse {
  constructor({
    message,
    status = STATUS_CODE.OKE,
    reasonStatus = REASON_CODE.OKE,
    data = {},
  }) {
    this.message = message ? message : reasonStatus;
    this.status = status;
    this.data = data;
  }

  send(res) {
    return res.status(this.status).json(this);
  }
}

export class CREATE extends SuccessResponse {
  constructor({
    message = REASON_CODE.CREATE,
    status = STATUS_CODE.CREATE,
    data,
  }) {
    super({ message, status, reasonStatus, data });
  }
}

export class OKE extends SuccessResponse {
  constructor({ message = REASON_CODE.CREATE, data }) {
    super({ message, data });
  }
}
