import Submission from "@/core/submission/domain/SubmissionEntity";
import Grade from "@/core/submission/domain/value-objects/Grade.vo";
import RepositoryURL from "@/core/submission/domain/value-objects/RepositoryURL.vo";
import SubmissionStatus from "@/core/submission/domain/value-objects/SubmissionStatus.vo";
import PaginatedResult from "@/shared/domain/common/PaginatedResult";
import PaginationParams from "@/shared/domain/common/PaginationParams";
import Identifier from "@/shared/domain/value-objects/Identifier.vo";
import { Prisma } from "@prisma/client";

type PrismaSubmission = Prisma.SubmissionGetPayload<{}>;

export default class PrismaSubmissionFactory {
  static from(props: PrismaSubmission): Submission {
    return Submission.create({
      challengeId: Identifier.from(props.challengeId),
      grade: Grade.create(props.grade),
      repositoryURL: RepositoryURL.create(props.repositoryURL),
      status: SubmissionStatus.fromString(props.status),
      createdAt: props.createdAt
    }, Identifier.from(props.id));
  }

  static paginate(
    prismaSubmission: Array<PrismaSubmission>,
    total: number,
    pagination: PaginationParams
  ): PaginatedResult<Submission> {
    const submissions = prismaSubmission.map(submission => this.from(submission));
    return PaginatedResult.create(submissions, total, pagination);
  }
}