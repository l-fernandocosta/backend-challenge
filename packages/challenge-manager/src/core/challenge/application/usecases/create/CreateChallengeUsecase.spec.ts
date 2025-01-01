import { CreateChallengeInput } from "@/core/challenge/infra/graphql/input/CreateChallengeInput";
import InvalidDomainException from "@/shared/domain/exceptions/InvalidDomainException";
import CreateChallengeUseCase from "./CreateChallengeUseCase";
import { MockChallengeRepository } from "@/core/challenge/domain/persistence/MockChallengeRepository";

describe('CreateChallengeUseCase', () => {
  let useCase: CreateChallengeUseCase;
  let repository: MockChallengeRepository;

  beforeEach(() => {
    repository = new MockChallengeRepository();
    useCase = new CreateChallengeUseCase(repository);
  });

  it('should create a challenge when valid input is provided', async () => {
    const input: CreateChallengeInput = {
      title: 'New Challenge',
      description: 'A description of the new challenge',
    };

    const challenge = await useCase.execute(input);

    expect(challenge).toBeDefined();
    expect(challenge.getTitle()).toBe(input.title);
    expect(challenge.getDescription()).toBe(input.description);
  });

  it('should throw an error if the challenge is invalid', async () => {
    const input: CreateChallengeInput = {
      title: '', // Invalid title
      description: 'A description of the new challenge',
    };

    await expect(useCase.execute(input)).rejects.toThrow(InvalidDomainException);
  });

  it('should call the repository create method', async () => {
    const input: CreateChallengeInput = {
      title: 'Challenge to check repo call',
      description: 'Description for challenge repo call check',
    };

    const createSpy = jest.spyOn(repository, 'create');

    await useCase.execute(input);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
      title: input.title,
      description: input.description,
    }));
  });

  it('should throw a validation error if the challenge input is invalid', async () => {
    const input: CreateChallengeInput = {
      title: '', // Invalid title
      description: 'A description with invalid title',
    };

    await expect(useCase.execute(input)).rejects.toThrowError(new InvalidDomainException({
      validationErrors: expect.any(Array),
    }));
  });
});
