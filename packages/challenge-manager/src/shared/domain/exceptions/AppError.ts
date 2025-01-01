type AppErrorProps = {
  statusCode: number;
  message: string;
  details?: string;
  validationErrors?: { property: string; message: string }[];
}

export default class AppError extends Error {
  statusCode: number;
  message: string;
  details?: string;
  validationErrors?: { property: string; message: string }[];

  constructor(props: AppErrorProps) {
    super(props.message);
    this.statusCode = props.statusCode;
    this.message = props.message;
    this.details = props.details;
    this.validationErrors = props.validationErrors;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}