import { StatusMapper } from "@/core/submission/domain/value-objects/SubmissionStatus.vo";
import { Field, ID, InputType } from "@nestjs/graphql";

// scalar types
import { GradeScalar } from "../scalars/Grade.scalar";
import { RepositoryScalar } from "../scalars/RepositoryURL.scalar";
import { SubmissionStatusScalar } from "../scalars/SubmissionStatus.scalar";

@InputType()
export default class SendSubmissionInput {
  @Field(() => ID)
  challengeId: string; 

  @Field(() => RepositoryScalar)
  repositoryURL: string;

  @Field(() => SubmissionStatusScalar, { nullable: true, defaultValue: StatusMapper.Pending.toString() })
  status?: string;

  @Field(() => GradeScalar, { nullable: true })
  grade?: number;
}