import Identifier from "@/shared/domain/value-objects/Identifier.vo";
import Challenge from "../ChallengeEntity";
import ChallengeFilters from "./ChallengeFilters";
import PaginationParams  from "@/shared/domain/common/PaginationParams";
import PaginatedResult  from "@/shared/domain/common/PaginatedResult";

export default abstract class ChallengeRepository {
  abstract create(challenge: Challenge): Promise<Challenge>;
  abstract update(challenge: Challenge): Promise<Challenge>;
  abstract delete(challengeId: Identifier): Promise<void>;
  abstract list(
    filters?: ChallengeFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Challenge>>;
}
