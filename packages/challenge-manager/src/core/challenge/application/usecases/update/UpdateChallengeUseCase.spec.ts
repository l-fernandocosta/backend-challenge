import Challenge from '@/core/challenge/domain/ChallengeEntity';
import ChallengeRepository from '@/core/challenge/domain/persistence/ChallengeRepository';
import { UpdateChallengeInput } from '@/core/challenge/infra/graphql/input/UpdateChallengeInput';
import InvalidDomainException from '@/shared/domain/exceptions/InvalidDomainException';
import Identifier from '@/shared/domain/value-objects/Identifier.vo';
import { Test, TestingModule } from '@nestjs/testing';
import UpdateChallengeUseCase from './UpdateChallengeUseCase';

describe('UpdateChallengeUseCase', () => {
  let useCase: UpdateChallengeUseCase;
  let challengeRepository: ChallengeRepository;

  const mockChallenge = {
    title: 'Updated Challenge',
    description: 'Updated Description',
    id: Identifier.create().value,
  };

  const mockChallengeEntity = Challenge.create({
    title: mockChallenge.title,
    description: mockChallenge.description,
  }, Identifier.from(mockChallenge.id));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateChallengeUseCase,
        {
          provide: ChallengeRepository,
          useValue: {
            update: jest.fn().mockResolvedValue(mockChallengeEntity),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateChallengeUseCase>(UpdateChallengeUseCase);
    challengeRepository = module.get<ChallengeRepository>(ChallengeRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw InvalidDomainException if validation fails', async () => {
    mockChallengeEntity.validate = jest.fn().mockReturnValue({
      getErrors: jest.fn().mockReturnValue(['Invalid title']),
    });

    const input: UpdateChallengeInput = {
      id: Identifier.create().value,
      title: '', // Invalid title
      description: 'Updated Description',
    };

    await expect(useCase.execute(input)).rejects.toThrow(InvalidDomainException);
  });

  it('should return the updated challenge after successful update', async () => {
    const input: UpdateChallengeInput = {
      id: Identifier.create().value,
      title: 'Updated Challenge',
      description: 'Updated Description',
    };

    const updatedChallenge = await useCase.execute(input);

    expect(updatedChallenge).toEqual(mockChallengeEntity);
  });

});
