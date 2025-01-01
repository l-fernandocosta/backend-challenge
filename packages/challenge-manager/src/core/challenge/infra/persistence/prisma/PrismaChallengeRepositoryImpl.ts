import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

import Challenge from "@/core/challenge/domain/ChallengeEntity";
import ChallengeFilters from "@/core/challenge/domain/persistence/ChallengeFilters";
import ChallengeRepository from "@/core/challenge/domain/persistence/ChallengeRepository";
import PaginatedResult from "@/shared/domain/common/PaginatedResult";
import PaginationParams from "@/shared/domain/common/PaginationParams";
import Identifier from "@/shared/domain/value-objects/Identifier.vo";
import PrismaChallengeFactory from "./PrismaChallengeFactory";
import PrismaService from "./PrismaClient";
import AppError from "@/shared/domain/exceptions/AppError";

@Injectable()
export default class PrismaChallengeReposityImpl implements ChallengeRepository {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(challenge: Challenge): Promise<Challenge> {
    const prismaChallenge = await this.prisma.challenge.create({
      data: {
        description: challenge.getDescription(),
        title: challenge.getTitle(),
      },
      include: {
        Submission: true,
      }
    });

    return PrismaChallengeFactory.create(prismaChallenge);
  }

  async update(challenge: Challenge): Promise<Challenge> {
    const prismaChallenge = await this.prisma.challenge.findUnique({
      where: {
        id: challenge.id.value,
      }
    })

    if (!prismaChallenge) {
      throw new AppError({
        message: `Challenge with id ${challenge.id.value} not found`,
        statusCode: HttpStatus.NOT_FOUND 
      });
    }

    const prismaChallengeUpdated = await this.prisma.challenge.update({
      where: {
        id: challenge.id.value,
      },
      data: {
        description: challenge.getDescription(),
        title: challenge.getTitle(),
      },
      include: {
        Submission: true
      }
    });

    return PrismaChallengeFactory.create(prismaChallengeUpdated);
  }

  async delete(challengeId: Identifier): Promise<void> {
    const challenge = await this.prisma.challenge.findUnique({
      where: {
        id: challengeId.value
      }
    })

    if (!challenge) {
      throw new AppError({
        message: `Challenge with id ${challengeId.value} not found`,
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    await this.prisma.challenge.delete({ where: { id: challengeId.value } })
  }

  async list(filters?: ChallengeFilters, pagination?: PaginationParams): Promise<PaginatedResult<Challenge>> {
    const prismaFilters = filters.toPrismaQuery();

    const prismaChallenges = await this.prisma.challenge.findMany({
      where: prismaFilters,
      skip: pagination.skip,
      take: pagination.take,
      include: { Submission: true }
    });

    const total = await this.prisma.challenge.count({
      where: prismaFilters
    });


    return PrismaChallengeFactory.paginate(prismaChallenges, total, pagination);
  }
}