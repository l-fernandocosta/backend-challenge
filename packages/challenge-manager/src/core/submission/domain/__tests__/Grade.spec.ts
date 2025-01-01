import Grade from "../value-objects/Grade.vo";

describe("Grade Value Object", () => {
  it("should create a Grade with a default value of 0 when no value is provided", () => {
    const grade = Grade.create();
    expect(grade.getValue()).toBe(0);
  });

  it("should create a Grade with the provided value when it is within the valid range", () => {
    const grade = Grade.create(85);
    expect(grade.getValue()).toBe(85);
  });

  it("should correctly identify a valid grade value", () => {
    expect(Grade.isValid(50)).toBe(true);
    expect(Grade.isValid(Grade.MAX_GRADE)).toBe(true);
    expect(Grade.isValid(Grade.MIN_GRADE)).toBe(true);
  });

  it("should correctly identify an invalid grade value", () => {
    expect(Grade.isValid(-1)).toBe(false);
    expect(Grade.isValid(Grade.MAX_GRADE + 1)).toBe(false);
  });

  it("should return the value as a string when toString is called", () => {
    const grade = Grade.create(75);
    expect(grade.toString()).toBe("75");
  });

  it("should correctly identify an invalid grade value using isValid", () => {
    expect(Grade.isValid(Grade.MIN_GRADE - 1)).toBe(false);
    expect(Grade.isValid(Grade.MAX_GRADE + 1)).toBe(false);
  });

});
