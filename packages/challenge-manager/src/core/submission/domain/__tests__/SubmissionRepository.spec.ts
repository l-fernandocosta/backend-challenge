import PaginatedResult from "@/shared/domain/common/PaginatedResult";
import PaginationParams from "@/shared/domain/common/PaginationParams";
import { SubmissionBuilder } from "../builders/SubmissionTestBuilder";
import SubmissionFilters from "../persistence/SubmissionFIlters";
import { TestSubmissionRepository } from "../persistence/TestSubmissionRepository";
import { StatusMapper } from "../value-objects/SubmissionStatus.vo";

describe('SubmissionRepository', () => {
  let submissionRepository: TestSubmissionRepository;

  beforeEach(() => {
    submissionRepository = new TestSubmissionRepository();
  });

  describe('send', () => {
    it('should return the same submission object', async () => {
      const submission = SubmissionBuilder.create().build();

      const result = await submissionRepository.send(submission);

      expect(result).toBe(submission);
    });
  });

  describe('list', () => {
    it('should return paginated results', async () => {
      const paginationParams = new PaginationParams(1, 10);
      const result = await submissionRepository.list(paginationParams);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.data.length).toBe(2);
      expect(result.totalItems).toBe(2);
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(1);
    });

    it('should filter submissions by challengeId', async () => {
      const filters = new SubmissionFilters('123', undefined, undefined, undefined);
      const paginationParams = new PaginationParams(1, 10);
      const listSpy = jest.spyOn(submissionRepository, 'list').mockResolvedValue(PaginatedResult.create([], 0, paginationParams));

      await submissionRepository.list(paginationParams, filters);

      expect(listSpy).toHaveBeenCalledWith(paginationParams, filters);
    });

    it('should filter by status', async () => {
      const status = StatusMapper.Pending  // Exemplo de status fictício
      const filters = new SubmissionFilters(undefined, undefined, undefined, status);

      const query = filters.toPrismaQuery();
      expect(query.status).toBe(status);
    });
  });
});