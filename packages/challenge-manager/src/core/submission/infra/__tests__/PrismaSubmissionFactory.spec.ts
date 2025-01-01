import Submission from "@/core/submission/domain/SubmissionEntity";
import PaginatedResult from "@/shared/domain/common/PaginatedResult";
import PaginationParams from "@/shared/domain/common/PaginationParams";
import { SubmissionStatus } from "@prisma/client";
import PrismaSubmissionFactory from "../persistence/prisma/PrismaSubmissionFactory";

jest.mock("@prisma/client", () => ({
  Prisma: {
    SubmissionGetPayload: jest.fn(),
  },
}));

describe('PrismaSubmissionFactory', () => {
  const mockPrismaSubmission = {
    id: '1',
    challengeId: 'challengeId123',
    grade: 85,
    repositoryURL: 'https://github.com/user/repository',
    status: 'Pending' as SubmissionStatus,
    createdAt: new Date(),
  };

  describe('from', () => {
    it('should correctly convert a Prisma submission to a Submission entity', () => {
      const submission = PrismaSubmissionFactory.from(mockPrismaSubmission);

      expect(submission).toBeInstanceOf(Submission);
      expect(submission.getChallengeId().value).toBe(mockPrismaSubmission.challengeId);
      expect(submission.getGrade().getValue()).toBe(mockPrismaSubmission.grade);
      expect(submission.getRepositoryURL().getValue()).toBe(mockPrismaSubmission.repositoryURL);
      expect(submission.getStatus().getValue()).toBe(mockPrismaSubmission.status);
    });
  });

  describe('paginate', () => {
    it('should correctly paginate submissions', () => {
      const prismaSubmissions = [
        mockPrismaSubmission,
        { ...mockPrismaSubmission, id: '2' },
        { ...mockPrismaSubmission, id: '3' }
      ];

      const paginationParams = new PaginationParams(1, 2); 
      const total = 3;

      const paginatedResult = PrismaSubmissionFactory.paginate(prismaSubmissions, total, paginationParams);

      expect(paginatedResult).toBeInstanceOf(PaginatedResult);
      expect(paginatedResult.data.length).toBe(3); 
      expect(paginatedResult.totalItems).toBe(total);
      expect(paginatedResult.totalPages).toBe(2);
      expect(paginatedResult.totalItems).toBe(3);
    });
  });
});
