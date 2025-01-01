import AppError from '@/shared/domain/exceptions/AppError';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(AppError)
export class GraphqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: AppError, host: ArgumentsHost) {
    const errorDetails = exception.validationErrors ? exception.validationErrors?.map(error => ({
      property: error.property,
      message: error.message,
    })) : exception.message;

    return new GraphQLError(
      exception.message,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { errors: errorDetails },
    );
  }
}
