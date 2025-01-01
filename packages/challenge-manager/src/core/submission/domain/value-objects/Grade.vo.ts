import ValueObject from "@/shared/domain/value-objects/IValueObject.vo";

export default class Grade extends ValueObject {
  private readonly value: number;
  static readonly MAX_GRADE = 100;
  static readonly MIN_GRADE = 0;

  private constructor(value?: number) {
    super();
    Grade.isValid(this.value);
    this.value = value ?? 0;
  }

  public static isValid(value: number): boolean {
    const isOk = value >= Grade.MIN_GRADE && value <= Grade.MAX_GRADE;
    return isOk;
  }

  public static create(value?: number): Grade {
    return new Grade(value ?? 0);
  }

  public getValue(): number {
    return this.value;
  }

  public toString()  : string {
    return this.value.toString();
  }

  public toJSON(): number {
    return this.value
  }
}