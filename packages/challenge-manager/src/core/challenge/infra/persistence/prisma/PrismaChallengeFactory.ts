import Challenge from "@/core/challenge/domain/ChallengeEntity";
import PaginatedResult from "@/shared/domain/common/PaginatedResult";
import PaginationParams from "@/shared/domain/common/PaginationParams";
import Identifier from "@/shared/domain/value-objects/Identifier.vo";
import { Prisma } from "@prisma/client";

type PrismaChallenge = Prisma.ChallengeGetPayload<{include: { Submission: true}}>;
export default class PrismaChallengeFactory {
  
  static create(prismaChallenge: PrismaChallenge) : Challenge {
    return Challenge.create({
      description: prismaChallenge.description,
      title: prismaChallenge.title,
      createdAt: prismaChallenge.createdAt,
    }, Identifier.from(prismaChallenge.id));
  }

  static paginate(prismaChallenges: PrismaChallenge[], total: number, pagination: PaginationParams): PaginatedResult<Challenge> {
    const challenges = prismaChallenges.map(prismaChallenge => this.create(prismaChallenge));
    return PaginatedResult.create(challenges, total, pagination);
  }
}