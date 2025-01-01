import PaginatedResult from "@/shared/domain/common/PaginatedResult";
import PaginationParams from "@/shared/domain/common/PaginationParams";
import { SubmissionBuilder } from "../builders/SubmissionTestBuilder";
import Submission from "../SubmissionEntity";
import SubmissionFilters from "./SubmissionFIlters";
import SubmissionRepository from "./SubmissionRepository";

export class TestSubmissionRepository implements SubmissionRepository {
  async send(submission: Submission): Promise<Submission> {
    return submission;
  }

  async list(pagination: PaginationParams, filters?: SubmissionFilters): Promise<PaginatedResult<Submission>> {
    const submission  = SubmissionBuilder.create().build();
    const submission2 = SubmissionBuilder.create().build();

    const submissions = [submission, submission2];

    return PaginatedResult.create(submissions, 2, pagination);
  }
}