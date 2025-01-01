import Notification, { NotificationError } from "../validation/Notification";
describe('Notification', () => {

  it('should create a new Notification instance', () => {
    const notification = Notification.create();
    expect(notification).toBeInstanceOf(Notification);
    expect(notification.hasError()).toBe(false);
  });

  it('should add an error correctly', () => {
    const notification = Notification.create();
    const error: NotificationError = { property: 'name', message: 'Name is required' };

    notification.addError(error);

    expect(notification.hasError()).toBe(true);
    expect(notification.getErrors()).toHaveLength(1);
    expect(notification.getErrors()[0]).toEqual(error);
  });

  it('should return true when there is at least one error', () => {
    const notification = Notification.create();
    const error: NotificationError = { property: 'email', message: 'Email is invalid' };

    notification.addError(error);

    expect(notification.hasError()).toBe(true);
  });

  it('should return false when there are no errors', () => {
    const notification = Notification.create();

    expect(notification.hasError()).toBe(false);
  });

  it('should return all errors with getErrors', () => {
    const notification = Notification.create();
    const error1: NotificationError = { property: 'name', message: 'Name is required' };
    const error2: NotificationError = { property: 'email', message: 'Email is invalid' };

    notification.addError(error1);
    notification.addError(error2);

    expect(notification.getErrors()).toEqual([error1, error2]);
    expect(notification.getErrors()).toHaveLength(2);
  });

  it('should return the first error with getFirstError', () => {
    const notification = Notification.create();
    const error1: NotificationError = { property: 'name', message: 'Name is required' };
    const error2: NotificationError = { property: 'email', message: 'Email is invalid' };

    notification.addError(error1);
    notification.addError(error2);

    expect(notification.getFirstError()).toEqual(error1);
  });

  it('should return null when getFirstError is called with no errors', () => {
    const notification = Notification.create();

    expect(notification.getFirstError()).toBeNull();
  });

});
