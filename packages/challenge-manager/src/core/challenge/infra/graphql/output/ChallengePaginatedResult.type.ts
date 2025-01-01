import Challenge from "@/core/challenge/domain/ChallengeEntity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import ChallengeType from "../types/Challenge.type";

@ObjectType()
export class ChallengePaginatedResult {
  @Field(() => [ChallengeType])
  data: Challenge[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

}