import SendSubmissionInput from "../../infra/graphql/input/SendSubmissionInput";
import { SubmissionBuilder } from '../builders/SubmissionTestBuilder';
import Grade from "../value-objects/Grade.vo";

describe('SubmissionBuilder', () => {
  it('should create a Submission with default values', () => {
    const builder = SubmissionBuilder.create();
    const submission = builder.build();

    expect(submission.getChallengeId().value).toBeDefined();
    expect(submission.getRepositoryURL().getValue()).toBe('https://github.com/user/repository');
    expect(submission.getStatus().getValue()).toBe('Pending');
    expect(submission.getGrade()).toBeInstanceOf(Grade);
    expect(submission.getCreatedAt()).toBeInstanceOf(Date);
  });

  it('should create a Submission with custom challengeId and status', () => {
    const builder = SubmissionBuilder.create();
    const submission = builder
      .withChallengeId('87cac595-3ab1-4acc-9970-64b88d172aa2')
      .withStatus('Pending')
      .build();

    expect(submission.getChallengeId().value).toBe('87cac595-3ab1-4acc-9970-64b88d172aa2');
    expect(submission.getStatus().getValue()).toBe('Pending');
  });

  it('should build a Submission with custom grade', () => {
    const builder = SubmissionBuilder.create();
    const submission = builder
      .withGrade(85)
      .build();

    expect(submission.getGrade().getValue()).toBe(85);
  });

  it('should correctly assign a custom createdAt date', () => {
    const customDate = new Date('2023-12-31T00:00:00Z');
    const builder = SubmissionBuilder.create();
    const submission = builder.withCreatedAt(customDate).build();

    expect(submission.getCreatedAt()).toBeInstanceOf(Date);
  });

  it('should return a valid SendSubmissionInput', () => {
    const builder = SubmissionBuilder.create();

    const submissionInput: SendSubmissionInput = builder
      .withChallengeId('87cac595-3ab1-4acc-9970-64b88d172aa2')
      .withStatus('Pending')
      .withGrade(75)
      .toInput();


    expect(submissionInput.challengeId).toBe('87cac595-3ab1-4acc-9970-64b88d172aa2');
    expect(submissionInput.status).toBe('Pending');
    expect(submissionInput.grade).toBe(75);
  });
});
