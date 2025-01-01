import PrismaService from "@/core/challenge/infra/persistence/prisma/PrismaClient";
import SubmissionFilters from "@/core/submission/domain/persistence/SubmissionFIlters";
import Submission from "@/core/submission/domain/SubmissionEntity";
import PaginatedResult from "@/shared/domain/common/PaginatedResult";
import PaginationParams from "@/shared/domain/common/PaginationParams";
import AppError from "@/shared/domain/exceptions/AppError";
import { HttpStatus, Injectable } from "@nestjs/common";
import PrismaSubmissionFactory from "./PrismaSubmissionFactory";
import SubmissionRepository from "@/core/submission/domain/persistence/SubmissionRepository";

@Injectable()
export default class PrismaSubmissionRepositoryImpl implements SubmissionRepository {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async send(submission: Submission): Promise<any> {
    const challenge = await this.prisma.challenge.findUnique({
      where: {
        id: submission.getChallengeId().value
      }
    })

    if (!challenge) {
      throw new AppError({
        message: "Challenge Not Found",
        statusCode: HttpStatus.NOT_FOUND
      })
    }

    const createdSubmission = await this.prisma.submission.create({
      data: {
        challengeId: submission.getChallengeId().value,
        grade: submission.getGrade().getValue(),
        repositoryURL: submission.getRepositoryURL().getValue(),
        status: submission.getStatus().getValue()
      },
      include: {
        challenge: true,
      }
    })

    return PrismaSubmissionFactory.from(createdSubmission);
  }

  async list(pagination: PaginationParams, filters?: SubmissionFilters): Promise<PaginatedResult<Submission>> {
    const prismaFilters = filters.toPrismaQuery();

    const prismaSubmission = await this.prisma.submission.findMany({
      where: prismaFilters, 
      skip: pagination.skip,
      take: pagination.take,
      include: { challenge: true }
    });

    const total  = await this.prisma.submission.count({
      where: prismaFilters
    });

    return PrismaSubmissionFactory.paginate(prismaSubmission, total, pagination);
  }

}