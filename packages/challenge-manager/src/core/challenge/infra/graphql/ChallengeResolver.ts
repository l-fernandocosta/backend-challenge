import { CreateChallengeInput } from "@/core/challenge/infra/graphql/input/CreateChallengeInput";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UpdateChallengeInput } from "./input/UpdateChallengeInput";
import { ChallengeFiltersInput } from "./input/ChallengeFiltersInput";
import { PaginationParamsInput } from "./input/PaginationParamsInput";
import { ChallengePaginatedResult } from "./output/ChallengePaginatedResult.type";

import CreateChallengeUseCase from "@/core/challenge/application/usecases/create/CreateChallengeUseCase";
import ListChallengesUseCase from "@/core/challenge/application/usecases/list/ListChallengesUseCase";
import RemoveChallengeUseCase from "@/core/challenge/application/usecases/remove/RemoveChallengeUseCase";
import UpdateChallengeUseCase from "@/core/challenge/application/usecases/update/UpdateChallengeUseCase";
import ChallengeType from "@/core/challenge/infra/graphql/types/Challenge.type";
import Identifier from "@/shared/domain/value-objects/Identifier.vo";

@Resolver(() => ChallengeType)
export class ChallengeResolver {
  constructor(
    private readonly createChallengeUseCase: CreateChallengeUseCase,
    private readonly removeChallengeUSeCase: RemoveChallengeUseCase,
    private readonly updateChallengeUseCase: UpdateChallengeUseCase,
    private readonly listChallengesUseCase: ListChallengesUseCase
  ) { }

  @Mutation(() => ChallengeType)
  async createChallenge(
    @Args('input') input: CreateChallengeInput
  ) {
    const challenge = await this.createChallengeUseCase.execute(input);
    return challenge;
  }

  @Mutation(() => Boolean)
  async removeChallenge(
    @Args('id') id: string
  ){
    await this.removeChallengeUSeCase.execute(Identifier.from(id));
    return true;
  }

  @Mutation(() => ChallengeType)
  async updateChallenge(
    @Args('input') input: UpdateChallengeInput
  ){
    const challenge = await this.updateChallengeUseCase.execute(input);
    return challenge
  }

  @Query(() => ChallengePaginatedResult)
  async listChallenges(
    @Args('pagination') pagination: PaginationParamsInput,  
    @Args('filters', { nullable: true}) filters?: ChallengeFiltersInput,
  ) {
    return await this.listChallengesUseCase.execute({...filters, ...pagination})
  }
}