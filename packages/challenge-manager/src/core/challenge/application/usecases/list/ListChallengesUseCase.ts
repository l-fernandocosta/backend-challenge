import { ChallengeFiltersInput } from "@/core/challenge/infra/graphql/input/ChallengeFiltersInput";
import { PaginationParamsInput } from "@/core/challenge/infra/graphql/input/PaginationParamsInput";
import { Injectable } from "@nestjs/common";

import Challenge from "@/core/challenge/domain/ChallengeEntity";
import ChallengeFilters from "@/core/challenge/domain/persistence/ChallengeFilters";
import ChallengeRepository from "@/core/challenge/domain/persistence/ChallengeRepository";
import PaginatedResult from "@/shared/domain/common/PaginatedResult";
import PaginationParams from "@/shared/domain/common/PaginationParams";
import UseCase from "@/shared/application/usecases/UseCase";

export type ListChallengesInput = ChallengeFiltersInput & PaginationParamsInput;

@Injectable()
export default class ListChallengesUseCase implements UseCase<ListChallengesInput, PaginatedResult<Challenge>> {
  constructor(private readonly repository: ChallengeRepository){}

  execute(input: ListChallengesInput): Promise<PaginatedResult<Challenge>> {

    const filters : ChallengeFilters = ChallengeFilters.create({
      description: input.description, 
      title: input.title
    })

    const pagination : PaginationParams = PaginationParams.create({
      page: input.page,
      perPage: input.perPage
    });

    return this.repository.list(filters, pagination); 
  }
}