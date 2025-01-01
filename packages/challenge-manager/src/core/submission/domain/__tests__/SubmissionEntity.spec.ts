
import Notification from "@/shared/domain/validation/Notification";
import Identifier from "@/shared/domain/value-objects/Identifier.vo";
import Submission from "../SubmissionEntity";
import { InvalidRepositoryURLExceptionMessage } from "../exceptions/InvalidURLExceptionMessage";
import Grade from "../value-objects/Grade.vo";
import RepositoryURL from "../value-objects/RepositoryURL.vo";
import SubmissionStatus, { StatusMapper } from "../value-objects/SubmissionStatus.vo";

describe("Submission Entity", () => {
  const validChallengeId = Identifier.from("123e4567-e89b-12d3-a456-426614174000");
  const validRepositoryURL = RepositoryURL.create("https://github.com/user/repo");
  const validStatus = SubmissionStatus.create(StatusMapper.Pending);
  const validGrade = Grade.create(85);

  it("should create a valid Submission entity", () => {
    const submission = Submission.create({
      challengeId: validChallengeId,
      repositoryURL: validRepositoryURL,
      status: validStatus,
      grade: validGrade,
    });

    expect(submission).toBeInstanceOf(Submission);
    expect(submission.getChallengeId()).toBe(validChallengeId);
    expect(submission.getRepositoryURL()).toBe(validRepositoryURL);
    expect(submission.getStatus()).toBe(validStatus);
    expect(submission.getGrade()).toBe(validGrade);
    expect(submission.getCreatedAt()).toBeInstanceOf(Date);
  });

  it("should set and validate a new grade", () => {
    const submission = Submission.create({
      challengeId: validChallengeId,
      repositoryURL: validRepositoryURL,
      status: validStatus,
    });

    const newGrade = Grade.create(95);
    submission.setGrade(newGrade);

    expect(submission.getGrade()).toBe(newGrade);
    expect(submission.validate()).toBeInstanceOf(Notification);
  });

  it("should validate a Submission entity with valid data", () => {
    const submission = Submission.create({
      challengeId: validChallengeId,
      repositoryURL: validRepositoryURL,
      status: validStatus,
      grade: validGrade,
    });

    const notification = submission.validate();

    expect(notification.hasError()).toBe(false);
  });

  it("should validate a Submission entity with invalid data", () => {
    const invalidRepositoryURL = RepositoryURL.create("invalid-url");

    const submission = Submission.create({
      challengeId: validChallengeId,
      repositoryURL: invalidRepositoryURL,
      status: validStatus,
    });

    const notification = submission.validate();

    expect(notification.hasError()).toBe(true);

    expect(notification.getErrors()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: "repositoryURL", message: InvalidRepositoryURLExceptionMessage }),
      ])
    );
  });

  it("should validate an invalid grade", () => {
    const invalidGrade = Grade.create(150);

    const submission = Submission.create({
      challengeId: validChallengeId,
      repositoryURL: validRepositoryURL,
      status: validStatus,
      grade: invalidGrade,
    });

    const notification = submission.validate();

    expect(notification.hasError()).toBe(true);
    expect(notification.getErrors()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: "grade" }),
      ])
    );
  });

  it("should allow creating a Submission entity without a grade", () => {
    const submission = Submission.create({
      challengeId: validChallengeId,
      repositoryURL: validRepositoryURL,
      status: validStatus,
    });

    expect(submission.getGrade()).toBeInstanceOf(Grade);
  });

  it("should correctly return the createdAt date", () => {
    const submission = Submission.create({
      challengeId: validChallengeId,
      repositoryURL: validRepositoryURL,
      status: validStatus,
    });

    expect(submission.getCreatedAt()).toBeInstanceOf(Date);
  });
});
