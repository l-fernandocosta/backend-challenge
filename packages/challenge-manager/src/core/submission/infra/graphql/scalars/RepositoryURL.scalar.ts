import { InvalidRepositoryURLExceptionMessage } from "@/core/submission/domain/exceptions/InvalidURLExceptionMessage";
import RepositoryURL from "@/core/submission/domain/value-objects/RepositoryURL.vo";
import AppError from "@/shared/domain/exceptions/AppError";
import { HttpStatus } from "@nestjs/common";
import { GraphQLScalarType, Kind } from "graphql";

export const RepositoryScalar = new GraphQLScalarType({
  name: 'RepositoryUrlScalar',
  description: 'A string representing a valid repository URL',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast) => validate(ast.kind === Kind.STRING ? ast.value : null)
})

function validate(value: unknown) {

  if (!value) {
    return null;
  }

  if (typeof value == 'string') {
    if (!RepositoryURL.isValidURL(value)) {
      throw new AppError({
        message: InvalidRepositoryURLExceptionMessage,
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

  }
  return value
}