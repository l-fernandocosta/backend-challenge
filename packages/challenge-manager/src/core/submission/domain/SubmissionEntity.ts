import Entity from "@/shared/domain/Entity";
import Notification from "@/shared/domain/validation/Notification";
import Identifier from "@/shared/domain/value-objects/Identifier.vo";
import SendSubmissionInput from "../infra/graphql/input/SendSubmissionInput";
import SubmissionValidator, { SubmissionRules } from "./validation/SubmissionValidator";
import Grade from "./value-objects/Grade.vo";
import RepositoryURL from "./value-objects/RepositoryURL.vo";
import SubmissionStatus from "./value-objects/SubmissionStatus.vo";

interface SubmissionConstructorProps {
  challengeId: Identifier;
  repositoryURL: RepositoryURL;
  status: SubmissionStatus;
  grade?: Grade;
  createdAt?: Date;
}

export default class Submission extends Entity {
  private repositoryURL: RepositoryURL;
  private challengeId: Identifier;
  private status: SubmissionStatus;
  private grade?: Grade;
  private createdAt: Date = new Date();

  constructor(props: SubmissionConstructorProps, id?: Identifier) {
    super(id);
    this.challengeId = props.challengeId;
    this.repositoryURL = props.repositoryURL;
    this.status = props.status;
    this.grade = props.grade ?? Grade.create();
    this.createdAt = props.createdAt ?? new Date();

    this.validate();
  }

  public validate(): Notification {
    const validator = SubmissionValidator.create();
    const rules: SubmissionRules = new SubmissionRules(this);
    return validator.validate(rules);
  }

  public getChallengeId(): Identifier {
    return this.challengeId;
  }

  public getRepositoryURL(): RepositoryURL {
    return this.repositoryURL;
  }

  public getStatus(): SubmissionStatus {
    return this.status;
  }

  public getGrade(): Grade {
    return this.grade;
  }

  public setGrade(value: Grade) {
    this.grade = value;
    this.validate();
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public static create(props: SubmissionConstructorProps, id?: Identifier): Submission {
    return new Submission(props, id);
  }

  public static fromInput(input: SendSubmissionInput) {
    return Submission.create({
      challengeId: Identifier.from(input.challengeId),
      repositoryURL: RepositoryURL.create(input.repositoryURL),
      status: SubmissionStatus.fromString(input.status),
      grade: Grade.create(input.grade)
    });
  }
}