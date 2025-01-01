import SubmissionRepository from "@/core/submission/domain/persistence/SubmissionRepository";
import Submission from "@/core/submission/domain/SubmissionEntity";
import SendSubmissionInput from "@/core/submission/infra/graphql/input/SendSubmissionInput";
import InvalidDomainException from "@/shared/domain/exceptions/InvalidDomainException";
import SendSubmissionUseCase from "./SendSubmissionUseCase";
import Notification from "@/shared/domain/validation/Notification";
import Identifier from "@/shared/domain/value-objects/Identifier.vo";

describe('SendSubmissionUseCase', () => {
  let useCase: SendSubmissionUseCase;
  let repository: jest.Mocked<SubmissionRepository>;

  beforeEach(() => {
    repository = {
      send: jest.fn(),
    } as unknown as jest.Mocked<SubmissionRepository>;

    useCase = new SendSubmissionUseCase(repository);
  });

  it('should call the repository with a valid submission and return the result', async () => {
    const mockInput: SendSubmissionInput = {
      challengeId: Identifier.create().value,
      repositoryURL: 'https://github.com/example/repo',
      status: 'Pending',
      grade: 95,
    };

    const mockSubmission = Submission.fromInput(mockInput);
    
    const notification = Notification.create();
    
    jest.spyOn(mockSubmission, 'validate').mockReturnValue(notification);


    repository.send.mockResolvedValueOnce(mockSubmission);

    const result = await useCase.execute(mockInput);

    expect(result.getChallengeId().value).toBe(mockSubmission.getChallengeId().value);
    expect(result).toBeInstanceOf(Submission);
    expect(result.getGrade().getValue()).toBe(95);
    expect(result.getCreatedAt()).toBeInstanceOf(Date);
    expect(result.getRepositoryURL().getValue()).toBe(mockSubmission.getRepositoryURL().getValue());
  });

  it('should throw an InvalidDomainException if validation fails', async () => {
    const mockInput: SendSubmissionInput = {
      challengeId: '123',
      repositoryURL: 'invalid-url',
      status: 'Pending',
      grade: 95,
    };

    const mockSubmission = Submission.fromInput(mockInput);
    const notification = Notification.create();
    notification.addError({ property: 'repositoryURL', message: 'Invalid repository URL' });

    jest.spyOn(mockSubmission, 'validate').mockReturnValue(notification);

    await expect(useCase.execute(mockInput)).rejects.toThrow(InvalidDomainException);
    await expect(useCase.execute(mockInput)).rejects.toThrowError(
      new InvalidDomainException({ validationErrors: notification.getErrors() })
    );
  });

  it('should propagate errors from the repository', async () => {
    const mockInput: SendSubmissionInput = {
      challengeId: '123',
      repositoryURL: 'https://github.com/example/repo',
      status: 'Pending',
      grade: 95,
    };

    const mockSubmission = Submission.fromInput(mockInput);
    const notification = Notification.create();
    jest.spyOn(mockSubmission, 'validate').mockReturnValue(notification);

    const error = new Error('Invalid domain exception');
    repository.send.mockRejectedValueOnce(error);

    await expect(useCase.execute(mockInput)).rejects.toThrow(error);
  });
});
