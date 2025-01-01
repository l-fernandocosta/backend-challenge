import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateChallengeInput {
  @Field()
  id: string;
  @Field()
  title: string;
  @Field()
  description: string;
}