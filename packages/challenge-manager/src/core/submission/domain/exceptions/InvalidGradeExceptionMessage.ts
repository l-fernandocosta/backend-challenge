import Grade from "../value-objects/Grade.vo";

export const InvalidGradeExceptionMessage = `Invalid grade: Grade must be between ${Grade.MIN_GRADE} and ${Grade.MAX_GRADE}`;