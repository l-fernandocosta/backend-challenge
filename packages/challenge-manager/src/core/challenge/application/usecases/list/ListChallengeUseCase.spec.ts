import Challenge from '@/core/challenge/domain/ChallengeEntity';
import ChallengeRepository from '@/core/challenge/domain/persistence/ChallengeRepository';
import { ChallengeFiltersInput } from '@/core/challenge/infra/graphql/input/ChallengeFiltersInput';
import { PaginationParamsInput } from '@/core/challenge/infra/graphql/input/PaginationParamsInput';
import PaginatedResult from '@/shared/domain/common/PaginatedResult';
import { Test, TestingModule } from '@nestjs/testing';
import ListChallengesUseCase from './ListChallengesUseCase';

describe('ListChallengesUseCase', () => {
  let useCase: ListChallengesUseCase;
  let challengeRepository: ChallengeRepository;

  const mockChallenges: Challenge[] = [
    Challenge.create({ title: 'Challenge 1', description: 'Description 1' }),
    Challenge.create({ title: 'Challenge 2', description: 'Description 2' }),
  ];

  const mockPaginatedResult = new PaginatedResult<Challenge>(mockChallenges, 2, 1, 1);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListChallengesUseCase,
        {
          provide: ChallengeRepository,
          useValue: {
            list: jest.fn().mockResolvedValue(mockPaginatedResult),
          },
        },
      ],
    }).compile();

    useCase = module.get<ListChallengesUseCase>(ListChallengesUseCase);
    challengeRepository = module.get<ChallengeRepository>(ChallengeRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return a paginated list of challenges', async () => {
    const input: ChallengeFiltersInput & PaginationParamsInput = {
      title: 'Challenge 1',
      description: 'Description 1',
      page: 1,
      perPage: 10,
    };

    const result = await useCase.execute(input);

    expect(result).toBeInstanceOf(PaginatedResult);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.totalItems).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(result.currentPage).toBe(1);
  });

  it('should call the repository list method with the correct filters and pagination', async () => {
    const input: ChallengeFiltersInput & PaginationParamsInput = {
      title: 'Challenge 1',
      description: 'Description 1',
      page: 1,
      perPage: 10,
    };

    await useCase.execute(input);

    expect(challengeRepository.list).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Challenge 1', description: 'Description 1' }),
      expect.objectContaining({ page: 1, perPage: 10 }),
    );
  });

  it('should return an empty list if no challenges match', async () => {
    const emptyChallenges: Challenge[] = [];
    const emptyResult = new PaginatedResult<Challenge>(emptyChallenges, 0, 0, 1);

    challengeRepository.list = jest.fn().mockResolvedValue(emptyResult);

    const input: ChallengeFiltersInput & PaginationParamsInput = {
      title: 'Non-existent challenge',
      description: 'Non-existent description',
      page: 1,
      perPage: 10,
    };

    const result = await useCase.execute(input);

    expect(result.data.length).toBe(0);
    expect(result.totalItems).toBe(0);
    expect(result.totalPages).toBe(0);
  });
});
