import ChallengeRepository from "@/core/challenge/domain/persistence/ChallengeRepository";
import Identifier from "@/shared/domain/value-objects/Identifier.vo";
import { Test, TestingModule } from "@nestjs/testing";
import RemoveChallengeUseCase from "./RemoveChallengeUseCase";

describe('RemoveChallengeUseCase', () => {
  let useCase: RemoveChallengeUseCase;
  let challengeRepository: ChallengeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveChallengeUseCase,
        {
          provide: ChallengeRepository,
          useValue: {
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    useCase = module.get<RemoveChallengeUseCase>(RemoveChallengeUseCase);
    challengeRepository = module.get<ChallengeRepository>(ChallengeRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should call the repository delete method with the correct identifier', async () => {
    const identifier = Identifier.create();

    await useCase.execute(identifier);

    expect(challengeRepository.delete).toHaveBeenCalledWith(identifier);
  });

  it('should not throw an error when challenge is deleted successfully', async () => {
    const identifier = Identifier.create();

    await expect(useCase.execute(identifier)).resolves.not.toThrow();
  });

  it('should throw an error if repository.delete fails', async () => {
    const identifier = Identifier.create();

    challengeRepository.delete = jest.fn().mockRejectedValue(new Error('Failed to delete challenge'));

    await expect(useCase.execute(identifier)).rejects.toThrow('Failed to delete challenge');
  });
});