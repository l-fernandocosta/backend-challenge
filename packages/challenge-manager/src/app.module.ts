import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import ChallengeModule from './core/challenge/infra/ChallengeModule';
import { GraphqlExceptionFilter } from './shared/infra/interceptor/GraphQLExceptionFilter';
import SubmissionModule from './core/submission/infra/SubmissionModule';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true, 
      sortSchema: true, 
      driver: ApolloDriver, 
      playground: true, 
    }), 
    ChallengeModule, 
    SubmissionModule, 
  ],
  providers: [
    {
      provide: APP_FILTER, 
      useClass: GraphqlExceptionFilter
    } 
  ]
})
export class AppModule { }
