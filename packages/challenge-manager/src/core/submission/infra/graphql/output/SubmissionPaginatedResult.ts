import Submission from "@/core/submission/domain/SubmissionEntity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import SubmissionType from "../types/Submission.type";

@ObjectType()
export class SubmissionPaginatedResult {
  @Field(() => [SubmissionType])
  data: Submission[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

}