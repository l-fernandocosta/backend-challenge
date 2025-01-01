import * as request from 'supertest';

import { GraphqlExceptionFilter } from '@/shared/infra/interceptor/GraphQLExceptionFilter';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';

import CreateChallengeUseCase from '@/core/challenge/application/usecases/create/CreateChallengeUseCase';
import ListChallengesUseCase from '@/core/challenge/application/usecases/list/ListChallengesUseCase';
import RemoveChallengeUseCase from '@/core/challenge/application/usecases/remove/RemoveChallengeUseCase';
import UpdateChallengeUseCase from '@/core/challenge/application/usecases/update/UpdateChallengeUseCase';
import ChallengeModule from '../ChallengeModule';

describe('ChallengeResolver (E2E)', () => {
  let app: INestApplication;
  let createChallengeUseCase: CreateChallengeUseCase;
  let listChallengesUseCase: ListChallengesUseCase;
  let removeChallengeUseCase: RemoveChallengeUseCase;
  let updateChallengeUseCase: UpdateChallengeUseCase;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          autoSchemaFile: true,
          playground: true,
          installSubscriptionHandlers: true,
          driver: ApolloDriver,
        }),
        ChallengeModule,
      ],
      providers: [
        {
          provide: APP_FILTER,
          useClass: GraphqlExceptionFilter
        },
        CreateChallengeUseCase,
        ListChallengesUseCase,
        RemoveChallengeUseCase,
        UpdateChallengeUseCase,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    createChallengeUseCase = moduleFixture.get<CreateChallengeUseCase>(CreateChallengeUseCase);
    listChallengesUseCase = moduleFixture.get<ListChallengesUseCase>(ListChallengesUseCase);
    removeChallengeUseCase = moduleFixture.get<RemoveChallengeUseCase>(RemoveChallengeUseCase);
    updateChallengeUseCase = moduleFixture.get<UpdateChallengeUseCase>(UpdateChallengeUseCase);
  });

  it('should create a challenge', async () => {
    const createChallengeInput = {
      title: 'Test Challenge',
      description: 'A test challenge description',
    };

    const response = await request(app.getHttpServer())
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
      .send({ variables: { input: createChallengeInput } });

    expect(response.status).toBe(200);
    expect(response.body.data.createChallenge).toHaveProperty('id');
    expect(response.body.data.createChallenge.title).toEqual(createChallengeInput.title);
    expect(response.body.data.createChallenge.description).toEqual(createChallengeInput.description);
  });

  it('should list challenges with pagination', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query ListChallenges($filters: ChallengeFiltersInput, $pagination: PaginationParamsInput!) {
            listChallenges(filters: $filters, pagination: $pagination) {
              data {
                id
                title
                description
              }
              totalItems
              totalPages
              currentPage
            }
          }
        `,
        variables: {
          filters: { title: 'Test' },
          pagination: { page: 0, perPage: 5 },
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.data.listChallenges.data).toBeInstanceOf(Array);
    expect(response.body.data.listChallenges.totalItems).toBeGreaterThanOrEqual(0);
    expect(response.body.data.listChallenges.totalPages).toBeGreaterThanOrEqual(0);
    expect(response.body.data.listChallenges.currentPage).toBeGreaterThanOrEqual(0);
  });

  it('should update a challenge', async () => {
    const createChallengeInput = {
      title: 'Test Challenge',
      description: 'A test challenge description',
    };


    const createResponse = await request(app.getHttpServer())
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
      .send({ variables: { input: createChallengeInput } });

    const challengeId = createResponse.body.data.createChallenge.id;

    const updateChallengeInput = {
      id: challengeId,
      title: 'Updated Challenge Title',
      description: 'Updated description',
    };

    const updateResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation UpdateChallenge($input: UpdateChallengeInput!) {
            updateChallenge(input: $input) {
              id
              title
              description
            }
          }
        `,
        variables: { input: updateChallengeInput },
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.updateChallenge.title).toEqual(updateChallengeInput.title);
    expect(updateResponse.body.data.updateChallenge.description).toEqual(updateChallengeInput.description);
  });

  it('should remove a challenge', async () => {
    const createChallengeInput = {
      title: 'Test Challenge for Removal',
      description: 'A challenge to be removed',
    };


    const createResponse = await request(app.getHttpServer())
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
      .send({ variables: { input: createChallengeInput } });

    const challengeId = createResponse.body.data.createChallenge.id;


    const removeResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation RemoveChallenge($id: String!) {
            removeChallenge(id: $id)
          }
        `,
        variables: { id: challengeId },
      });

    expect(removeResponse.status).toBe(200);
    expect(removeResponse.body.data.removeChallenge).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
