import { HttpStatus } from "@nestjs/common";
import AppError from "./AppError";

type InvalidDomainExceptionProps = {
  message?: string;
  details?: string;
  validationErrors?: { property: string; message: string }[];
}

export default class InvalidDomainException extends AppError {
  constructor({
    details, 
    message, 
    validationErrors
  }: InvalidDomainExceptionProps) {
    super({
      message: message || "Invalid domain exception",
      statusCode: HttpStatus.BAD_REQUEST,
      details, 
      validationErrors
    });
  }
}
