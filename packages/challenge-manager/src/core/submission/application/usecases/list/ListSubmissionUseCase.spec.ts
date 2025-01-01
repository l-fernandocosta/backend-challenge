import SubmissionRepository from "@/core/submission/domain/persistence/SubmissionRepository";
import PaginatedResult from "@/shared/domain/common/PaginatedResult";
import Submission from "@/core/submission/domain/SubmissionEntity";
import { StatusMapper } from "@/core/submission/domain/value-objects/SubmissionStatus.vo";
import PaginationParams from "@/shared/domain/common/PaginationParams";
import ListSubmissionsUseCase from "./LIstSubmissionsUseCase";

describe('ListSubmissionsUseCase', () => {
  let useCase: ListSubmissionsUseCase;
  let repository: jest.Mocked<SubmissionRepository>;

  beforeEach(() => {
    repository = {
      list: jest.fn(),
    } as unknown as jest.Mocked<SubmissionRepository>;

    useCase = new ListSubmissionsUseCase(repository);
  });

  it('should call the repository with correct parameters and return the result', async () => {
    const mockInput = {
      challengeId: '123',
      dateInit: new Date('2023-01-01'),
      dateEnd: new Date('2023-12-31'),
      status: 'COMPLETED',
      page: 1,
      perPage: 10,
    };

    const mockResult = PaginatedResult.create(
      [{ id: '1', challengeId: '123', status: 'COMPLETED', date: new Date() }],
      1,
      new PaginationParams(1, 10)
    );

    repository.list.mockResolvedValueOnce(mockResult);

    const result = await useCase.execute(mockInput);

    expect(repository.list).toHaveBeenCalledWith(
      new PaginationParams(mockInput.page, mockInput.perPage),
      {
        challengeId: mockInput.challengeId,
        dateInit: mockInput.dateInit,
        dateEnd: mockInput.dateEnd,
        status: StatusMapper[mockInput.status],
      }
    );

    expect(result).toEqual(mockResult);
  });

  it('should handle empty filters and pagination properly', async () => {
    const mockInput = {
      page: 1,
      perPage: 10,
    };

    const mockResult = PaginatedResult.create([], 0, new PaginationParams(1, 10));

    repository.list.mockResolvedValueOnce(mockResult);

    const result = await useCase.execute(mockInput);

    expect(repository.list).toHaveBeenCalledWith(
      new PaginationParams(mockInput.page, mockInput.perPage),
      {
        challengeId: undefined,
        dateInit: undefined,
        dateEnd: undefined,
        status: undefined,
      }
    );

    expect(result).toEqual(mockResult);
  });

  it('should propagate errors from the repository', async () => {
    const mockInput = {
      page: 1,
      perPage: 10,
    };

    const error = new Error('Repository error');
    repository.list.mockRejectedValueOnce(error);

    await expect(useCase.execute(mockInput)).rejects.toThrow(error);
  });
});
