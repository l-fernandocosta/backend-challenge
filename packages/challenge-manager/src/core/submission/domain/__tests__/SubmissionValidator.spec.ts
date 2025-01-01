import Identifier from "@/shared/domain/value-objects/Identifier.vo";
import Submission from "../SubmissionEntity";
import SubmissionValidator, { SubmissionRules } from "../validation/SubmissionValidator";
import Grade from "../value-objects/Grade.vo";
import RepositoryURL from "../value-objects/RepositoryURL.vo";
import SubmissionStatus, { StatusMapper } from "../value-objects/SubmissionStatus.vo";

describe("SubmissionValidator", () => {
  let validator: SubmissionValidator;

  beforeEach(() => {
    validator = SubmissionValidator.create();
  });

  it("should validate a valid SubmissionRules instance", () => {
    const rules: SubmissionRules = {
      challengeId: Identifier.from("123e4567-e89b-12d3-a456-426614174000"),
      repositoryURL: "https://github.com/user/repo",
      status: StatusMapper.Pending,
      grade: 85,
    };

    const notification = validator.validate(rules);
    
    expect(notification.hasError()).toBe(false);
  });

  it("should add errors for invalid UUID challengeId", () => {
    const invalidProps: SubmissionRules = {
      challengeId: "invalid-uuid" as unknown as Identifier,
      repositoryURL: "https://github.com/user/repo",
      status: StatusMapper.Pending,
      grade: 85,
    };

    const submission = Submission.create({
      challengeId: invalidProps.challengeId,
      repositoryURL: RepositoryURL.create(invalidProps.repositoryURL),
      status: SubmissionStatus.fromString(invalidProps.status),
      grade: Grade.create(invalidProps.grade),
    })

    const rules: SubmissionRules = new SubmissionRules(submission);

    const notification = validator.validate(rules);

    expect(notification.hasError()).toBe(true);

    expect(notification.getErrors()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: "challengeId" }),
      ])
    );
  });

  it("should add errors for invalid repositoryURL", () => {
    const rules: SubmissionRules = {
      challengeId: Identifier.from("123e4567-e89b-12d3-a456-426614174000"),
      repositoryURL: "invalid-url",
      status: StatusMapper.Pending,
      grade: 85,
    };

    const notification = validator.validate(rules);

    expect(notification.hasError()).toBe(true);

    expect(notification.getErrors()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: "repositoryURL" }),
      ])
    );
  });

  it("should add errors for invalid grade", () => {
    const rules: SubmissionRules = {
      challengeId: Identifier.from("123e4567-e89b-12d3-a456-426614174000"),
      repositoryURL: "https://github.com/user/repo",
      status: StatusMapper.Pending,
      grade: 150, 
    };

    const notification = validator.validate(rules);

    expect(notification.hasError()).toBe(true);
    expect(notification.getErrors()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: "grade" }),
      ])
    );
  });

  it("should allow optional grade", () => {
    const rules: SubmissionRules = {
      challengeId: Identifier.from("123e4567-e89b-12d3-a456-426614174000"),
      repositoryURL: "https://github.com/user/repo",
      status: StatusMapper.Pending,
    };

    const notification = validator.validate(rules);

    expect(notification.hasError()).toBe(false);
  });
});
