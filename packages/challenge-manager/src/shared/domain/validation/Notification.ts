export type NotificationError = {
  property: string;
  message: string;
}

export default class Notification {
  private constructor() {}

  private errors: Array<NotificationError> = [];

  public addError(error: NotificationError): void {
    this.errors.push(error);
  }

  public hasError() : boolean {
    return this.errors.length > 0;
  }

  public getErrors(): Array<NotificationError> {
    return this.errors;
  }

  public getFirstError(): NotificationError | null {
    return this.errors.length > 0 ? this.errors[0] : null;
  }

  static create(): Notification {
    return new Notification();
  }
}