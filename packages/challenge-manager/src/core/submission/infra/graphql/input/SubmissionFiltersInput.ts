import { Field, ID, InputType } from "@nestjs/graphql";
import { SubmissionStatusScalar } from "../scalars/SubmissionStatus.scalar";

@InputType()
export class SubmissionFiltersInput {
  @Field(() => ID, { nullable: true })
  challengeId?: string;

  @Field({ nullable: true })
  dateInit?: Date;

  @Field({ nullable: true })
  dateEnd?: Date;

  @Field(() => SubmissionStatusScalar, { nullable: true })
  status?: string;
}