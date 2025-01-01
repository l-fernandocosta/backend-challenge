import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class ChallengeType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
