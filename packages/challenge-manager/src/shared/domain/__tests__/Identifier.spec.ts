import { v4 as uuidv4, validate } from 'uuid';
import Identifier from '../value-objects/Identifier.vo';

describe('Identifier', () => {
  it('should create an Identifier with a generated id when no id is provided', () => {
    const identifier = Identifier.create();
    expect(identifier.value).toBeDefined();
    expect(validate(identifier.value)).toBe(true); 
  });

  it('should create an Identifier with a given valid id when an id is provided', () => {
    const customId = uuidv4(); 
    const identifier = Identifier.from(customId);
    expect(identifier.value).toBe(customId);
    expect(validate(identifier.value)).toBe(true); 
  });
  
  it('should return true when two Identifiers have the same id', () => {
    const id = uuidv4();
    const identifier1 = Identifier.from(id);
    const identifier2 = Identifier.from(id);

    expect(identifier1.equals(identifier2)).toBe(true);
  });

  it('should return false when two Identifiers have different ids', () => {
    const identifier1 = Identifier.from(uuidv4());
    const identifier2 = Identifier.from(uuidv4());

    expect(identifier1.equals(identifier2)).toBe(false);
  });

  it('should return false when comparing an Identifier with null', () => {
    const identifier = Identifier.create();

    expect(identifier.equals(null)).toBe(false);
  });

  it('should return false when comparing an Identifier with undefined', () => {
    const identifier = Identifier.create();

    expect(identifier.equals(undefined)).toBe(false);
  });

  it('should return false when comparing an Identifier with a different type of object', () => {
    const identifier = Identifier.create();
    const obj = { value: '12345' } as unknown as Identifier; 

    expect(identifier.equals(obj)).toBe(false);
  });
});
