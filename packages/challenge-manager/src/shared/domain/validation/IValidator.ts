import Notification from "./Notification";

export interface IValidator {
  validate(entity: any): Notification;
}