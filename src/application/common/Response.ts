export class Response<T> {
  constructor(
    public data: T | null,
    public message: string,
    public success: boolean,
    public errorCode?: string,
  ) {}
}
