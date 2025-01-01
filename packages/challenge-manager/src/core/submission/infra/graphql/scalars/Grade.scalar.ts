import Grade from '@/core/submission/domain/value-objects/Grade.vo';
import AppError from '@/shared/domain/exceptions/AppError';

import { InvalidGradeExceptionMessage } from '@/core/submission/domain/exceptions/InvalidGradeExceptionMessage';
import { HttpStatus } from '@nestjs/common';
import { GraphQLScalarType, Kind } from 'graphql';


export const GradeScalar  =  new GraphQLScalarType({
  name: 'GradeScalar', 
  description: `Grade custom scalar represents a numeric value between ${Grade.MIN_GRADE} and ${Grade.MAX_GRADE}`,
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast) => validate(ast.kind === Kind.INT || ast.kind === Kind.FLOAT ? parseFloat(ast.value) : undefined),
})

function validate(value: unknown){
  if(!value) {
    return Grade.MIN_GRADE;
  }

  if(typeof value === 'number') {
    const isGradeValid =  Grade.isValid(value);

    if(!isGradeValid){
      throw new AppError({
        message: InvalidGradeExceptionMessage,
        statusCode: HttpStatus.BAD_REQUEST
      });
    } 
  }

  return value;
}
