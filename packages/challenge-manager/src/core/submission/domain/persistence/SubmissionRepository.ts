import PaginatedResult from "@/shared/domain/common/PaginatedResult";
import PaginationParams from "@/shared/domain/common/PaginationParams";
import Submission from "../SubmissionEntity";
import SubmissionFilters from "./SubmissionFIlters";

export default abstract class SubmissionRepository {
  abstract send(submission: Submission): Promise<Submission>;
  abstract list( pagination: PaginationParams, filters?: SubmissionFilters): Promise<PaginatedResult<Submission>>;
}