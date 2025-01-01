import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GradeScalar } from '../scalars/Grade.scalar';
import { RepositoryScalar } from '../scalars/RepositoryURL.scalar';
import { SubmissionStatusScalar } from '../scalars/SubmissionStatus.scalar';

@ObjectType()
export default class SubmissionType {
  @Field(() => ID)
  id: string;

  @Field(() => RepositoryScalar)
  repositoryURL: string;

  @Field(() => SubmissionStatusScalar, { nullable: true })
  status: string;

  @Field(() => GradeScalar, { nullable: true })
  grade: number;

  @Field()
  createdAt: Date;

  @Field(() => ID)
  challengeId: string;
}
