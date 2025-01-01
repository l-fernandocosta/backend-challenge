import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { PaginationParamsInput } from "@/core/challenge/infra/graphql/input/PaginationParamsInput";
import { SubmissionFiltersInput } from "./input/SubmissionFiltersInput";
import { SubmissionPaginatedResult } from "./output/SubmissionPaginatedResult";

import ListSubmissionsUseCase from "@/core/submission/application/usecases/list/LIstSubmissionsUseCase";
import SendSubmissionUseCase from "@/core/submission/application/usecases/send/SendSubmissionUseCase";
import KafkaHelper from "@/shared/infra/kafka/common/KafkaHelpers";
import KafkaProducerService from "@/shared/infra/kafka/producer/KafkaProducerService";
import SendSubmissionInput from "./input/SendSubmissionInput";
import SubmissionType from "./types/Submission.type";

@Resolver(() => SubmissionType)
export class SubmissionResolver {
  constructor(
    private readonly sendSubmissionUseCase: SendSubmissionUseCase,
    private readonly listSubmissionsUseCase: ListSubmissionsUseCase, 
    private readonly kafkaService: KafkaProducerService
  ){};

  @Mutation(() => SubmissionType)
  async sendSubmission(
    @Args('input') input: SendSubmissionInput
  ){
    const submission = await this.sendSubmissionUseCase.execute(input);

    await this.kafkaService.sendMessage(KafkaHelper.CORRECT_LESSON_TOPIC, {
      repositoryUrl: submission.getRepositoryURL().getValue(),
      submissionId: submission.id.value, 
    });
    
    return submission;
  }

  @Query(() => SubmissionPaginatedResult)
  async listSubmissions(
    @Args('pagination') pagination: PaginationParamsInput,
    @Args('filters', { nullable: true }) filters?: SubmissionFiltersInput
  ){
    return await this.listSubmissionsUseCase.execute({...filters, ...pagination});
  }
}