import Entity from "../Entity";
import Notification, { NotificationError } from "../validation/Notification";
import Identifier from "../value-objects/Identifier.vo";

class TestEntity extends Entity {
  private title: string;
  constructor(title: string, id?: Identifier) {
    super(id);
    this.title = title;
  }

  public validate(): Notification {
    const notification = Notification.create();
    if (!this.title) {
      const error: NotificationError = { property: 'title', message: 'Title is required' };
      notification.addError(error);
    }
    return notification;
  }

  public getTitle(): string {
    return this.title;
  }
}

describe('Entity', () => {
  let entity: TestEntity;

  it('should create an entity with an id and props', () => {
    const arrange = { expected_title: 'Test Title' };

    entity = new TestEntity(arrange.expected_title);

    expect(entity.id).toBeDefined();
    expect(entity.getTitle()).toBe(arrange.expected_title);
  });

  it('should return the correct id value', () => {
    const arrange = { expected_title: 'Test Title' };

    const identifier = Identifier.create();

    entity = new TestEntity(arrange.expected_title, identifier);

    expect(entity.id).toBe(identifier);
  });

  it('should return true when two entities are equal', () => {
    const identifier = Identifier.create();
    const arrange = { expected_title: 'Test Title', expected_another_title: 'Another Title' };

    const entity1 = new TestEntity(arrange.expected_title, identifier);
    const entity2 = new TestEntity(arrange.expected_another_title, identifier);

    expect(entity1.equals(entity2)).toBe(true);
  });

  it('should return false when two entities have different ids', () => {
    const arrange = { expected_title: 'Test Title', expected_another_title: 'Another Title' };

    const entity1 = new TestEntity(arrange.expected_title);
    const entity2 = new TestEntity(arrange.expected_another_title);

    expect(entity1.equals(entity2)).toBe(false);
  });

  it('should validate the entity correctly', async () => {
    const arrange = {
      invalid_title: '',
      expected_error: [{ property: 'title', message: 'Title is required' }]
    }

    entity = new TestEntity(arrange.invalid_title);

    const notification = entity.validate();

    expect(notification.hasError()).toBe(true);
    expect(notification.getErrors()).toEqual(arrange.expected_error);
  });

  it('should pass validation when valid', async () => {
    entity = new TestEntity('Valid Title');

    const notification = entity.validate();

    expect(notification.hasError()).toBe(false);
  });
});
