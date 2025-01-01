import { PaginationParamsInput } from "@/core/challenge/infra/graphql/input/PaginationParamsInput";
import SubmissionFilters from "@/core/submission/domain/persistence/SubmissionFIlters";
import SubmissionRepository from "@/core/submission/domain/persistence/SubmissionRepository";
import Submission from "@/core/submission/domain/SubmissionEntity";
import { StatusMapper } from "@/core/submission/domain/value-objects/SubmissionStatus.vo";
import { SubmissionFiltersInput } from "@/core/submission/infra/graphql/input/SubmissionFiltersInput";
import UseCase from "@/shared/application/usecases/UseCase";
import PaginatedResult from "@/shared/domain/common/PaginatedResult";
import PaginationParams from "@/shared/domain/common/PaginationParams";
import { Injectable } from "@nestjs/common";

export type ListSubmissionsInput =  SubmissionFiltersInput & PaginationParamsInput

@Injectable()
export default class ListSubmissionsUseCase implements UseCase<ListSubmissionsInput, PaginatedResult<Submission>> {
  constructor(private readonly repository: SubmissionRepository) {}
  
  execute(input: ListSubmissionsInput): Promise<PaginatedResult<Submission>> {
    const filters: SubmissionFilters = SubmissionFilters.create({
      challengeId: input.challengeId,
      dateEnd: input.dateEnd,
      dateInit: input.dateInit,
      status: StatusMapper[input.status],
    })

    const pagination : PaginationParams = PaginationParams.create({
      page: input.page,
      perPage: input.perPage
    });

    return this.repository.list( pagination, filters);
  }
}