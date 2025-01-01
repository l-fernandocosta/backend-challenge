import { v4, validate } from 'uuid';
import ValueObject from './IValueObject.vo';

export default class Identifier extends ValueObject {
  private readonly id: string;

  private constructor(id?: string) {
    super();
    this.id = id || v4();
    Identifier.isValid(this.id);
  }

  public get value(): string {
    return this.id;
  }

  public static isValid(id: string) : boolean {
    const isValid =  validate(id);
    return isValid;
  }

  static create(): Identifier {
    return new Identifier();
  }

  static from(customId: string) : Identifier {
    return new Identifier(customId);
  }

  public toJSON(): string {
    return this.id;
  }
}