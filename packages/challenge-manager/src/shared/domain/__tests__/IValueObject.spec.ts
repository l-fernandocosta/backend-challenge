import ValueObject from '../value-objects/IValueObject.vo';

class ConcreteValueObject extends ValueObject {
  constructor(private value: number) {
    super();
  }

  getValue() {
    return this.value;
  }
}

describe('ValueObject', () => {
  it('should return true when the objects are equal', () => {
    const vo1 = new ConcreteValueObject(1);
    const vo2 = new ConcreteValueObject(1);

    expect(vo1.equals(vo2)).toBe(true);
  });

  it('should return false when the objects are different', () => {
    const vo1 = new ConcreteValueObject(1);
    const vo2 = new ConcreteValueObject(2);

    expect(vo1.equals(vo2)).toBe(false);
  });

  it('should return false when compared to null', () => {
    const vo1 = new ConcreteValueObject(1);

    expect(vo1.equals(null)).toBe(false);
  });

  it('should return false when compared to undefined', () => {
    const vo1 = new ConcreteValueObject(1);

    expect(vo1.equals(undefined)).toBe(false);
  });

  it('should return false when compared to a different type of object', () => {
    const vo1 = new ConcreteValueObject(1);
    const vo2 = { value: 1 } as unknown as ValueObject;

    expect(vo1.equals(vo2)).toBe(false);
  });
});
