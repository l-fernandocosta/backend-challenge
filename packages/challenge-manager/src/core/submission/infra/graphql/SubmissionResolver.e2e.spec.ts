// test/submission/submission.resolver.spec.ts
import ChallengeModule from '@/core/challenge/infra/ChallengeModule';
import { GraphqlExceptionFilter } from '@/shared/infra/interceptor/GraphQLExceptionFilter';
import { ApolloDriver } from '@nestjs/apollo';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import SubmissionModule from '../SubmissionModule';

describe('SubmissionResolver (e2e)', () => {
  let app;
  let httpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot({
          autoSchemaFile: true,
          installSubscriptionHandlers: true,
          driver: ApolloDriver,
        }),
        SubmissionModule,
        ChallengeModule,
      ],
      providers: [
        {
          provide: APP_FILTER,
          useClass: GraphqlExceptionFilter
        },
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    httpServer = app.getHttpServer();
    await app.init();
  });

  it('should return submission on sendSubmission mutation', async () => {
    const createChallengeInput = {
      title: 'Test Challenge',
      description: 'A test challenge description',
    };

    const challengeResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
              mutation CreateChallenge($input: CreateChallengeInput!) {
                createChallenge(input: $input) {
                  id
                  title
                  description
                }
              }
            `})
      .send({ variables: { input: createChallengeInput } })
      .expect(200)

    const challengeId = challengeResponse.body.data.createChallenge.id;

    const mutation = `
      mutation SendSubmission($input: SendSubmissionInput!) {
        sendSubmission(input: $input) {
          id
          repositoryURL
          grade
          status
        }
      }
    `;


    const input = {
      repositoryURL: 'https://github.com/test/repository',
      challengeId,
    };

    const response = await request(httpServer)
      .post('/graphql')
      .send({
        query: mutation,
        variables: { input },
      })
      .expect(200);


    expect(response.body.data.sendSubmission).toHaveProperty('id');
    expect(response.body.data.sendSubmission.repositoryURL).toBe(input.repositoryURL);
    expect(response.body.data.sendSubmission.grade).toBe(0);
    expect(response.body.data.sendSubmission.status).toBe('Pending');
  });

  it('should return paginated submissions on listSubmissions query', async () => {
    const query = `
      query ListSubmissions($pagination: PaginationParamsInput!, $filters: SubmissionFiltersInput) {
        listSubmissions(pagination: $pagination, filters: $filters) {
          items {
            id
            repositoryURL
            grade
            status
          }
          totalCount
        }
      }
    `;

    const pagination = { page: 1, limit: 10 };
    const filters = {};

    const response = await request(httpServer)
      .post('/graphql')
      .send({
        query: query,
        variables: { pagination, filters },
      })
      .expect(200);

    expect(response.body.data.listSubmissions.items).toBeInstanceOf(Array);
    expect(response.body.data.listSubmissions.items.length).toBeGreaterThan(0);
    expect(response.body.data.listSubmissions.totalCount).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await app.close();
  });
});
