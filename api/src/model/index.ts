import { IContext } from "../types";

export default class Result<T> {
  data: T | Error;
  status: number;

  constructor(data: T | Error, status: number) {
    this.data = data;
    this.status = status;
  }

  isError() {
    return this.data instanceof Error;
  }
  throwError(context: IContext) {
    context.res.status(this.status);
    if (this.isError()) throw this.getError();
  }
  isData() {
    return !this.isError();
  }
  getError() {
    return this.isError() ? this.data : undefined;
  }
  getData() {
    return !this.isError() ? this.data : undefined;
  }
}
