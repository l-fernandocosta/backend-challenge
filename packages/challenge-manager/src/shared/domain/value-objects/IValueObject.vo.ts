import { isEqual } from 'lodash';

export default abstract class ValueObject {
  equals(vo: ValueObject): boolean {
    if (vo === null || vo === undefined) return false;
    return isEqual(this, vo);
  }
}