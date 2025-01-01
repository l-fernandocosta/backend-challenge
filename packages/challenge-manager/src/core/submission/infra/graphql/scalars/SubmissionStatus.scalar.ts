import SubmissionStatus, { StatusMapper } from '@/core/submission/domain/value-objects/SubmissionStatus.vo';
import AppError from '@/shared/domain/exceptions/AppError';
import { HttpStatus } from '@nestjs/common';
import { GraphQLScalarType, Kind } from 'graphql';

export const SubmissionStatusScalar = new GraphQLScalarType({
  name: 'SubmissionStatus',
  description: 'SubmissionStatus custom scalar represents one of the following statuses: Pending, Error, Done',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast) => validate(ast.kind === Kind.STRING ? ast.value : null),
})

function validate(value: unknown) {

  if(!value){
    return SubmissionStatus.createPending().toString();
  }

  if(typeof value == 'string') {
    if (!SubmissionStatus.isValid(value as keyof typeof StatusMapper)) {
      throw new AppError({
        message: `SubmissionStatus must be one of: ${Object.values(StatusMapper).join(', ')}`,
        statusCode: HttpStatus.BAD_REQUEST
      });
    }
  }

  return value
}
