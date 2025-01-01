import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ChallengeFiltersInput {
  @Field({nullable: true})
  title?: string;

  @Field({nullable: true})
  description?: string;
}