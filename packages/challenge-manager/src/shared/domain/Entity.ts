import Notification from "./validation/Notification";
import Identifier from "./value-objects/Identifier.vo";

export default abstract class Entity {
  protected readonly _id: Identifier;

  constructor(id?: Identifier) {
    this._id = id ?? Identifier.create();
  }

  public get id(): Identifier {
    return this._id;
  }

  abstract validate(): Notification;

  public equals(entity: Entity): boolean {
    if (entity === null || entity === undefined) return false;
    if (!(entity instanceof Entity)) return false;
    return this._id.value === entity.id.value;
  }
}