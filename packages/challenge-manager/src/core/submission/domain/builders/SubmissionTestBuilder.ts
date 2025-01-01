import Identifier from "@/shared/domain/value-objects/Identifier.vo";
import RepositoryURL from "../value-objects/RepositoryURL.vo";
import SubmissionStatus from "../value-objects/SubmissionStatus.vo";
import Grade from "../value-objects/Grade.vo";
import Submission from "../SubmissionEntity";
import Entity from "@/shared/domain/Entity";
import Notification from "@/shared/domain/validation/Notification";
import SendSubmissionInput from "../../infra/graphql/input/SendSubmissionInput";


export class SubmissionBuilder extends Entity  {
  private challengeId: Identifier;
  private repositoryURL: RepositoryURL;
  private status: SubmissionStatus;
  private grade?: Grade;
  private createdAt?: Date;
  
  constructor(id?: Identifier) {
    super(id);
    this.challengeId = Identifier.create();
    this.repositoryURL = RepositoryURL.create('https://github.com/user/repository');
    this.status = SubmissionStatus.fromString('Pending');
    this.grade = Grade.create();  
    this.createdAt = new Date();
  }
  
  public static create(id?: Identifier): SubmissionBuilder {
    return new SubmissionBuilder(id);
  }

  public withChallengeId(challengeId: string): SubmissionBuilder {
    this.challengeId = Identifier.from(challengeId);
    return this;
  }
  
  public withRepositoryURL(repositoryURL: string): SubmissionBuilder {
    this.repositoryURL = RepositoryURL.create(repositoryURL);
    return this;
  }
  
  public withStatus(status: string): SubmissionBuilder {
    this.status = SubmissionStatus.fromString(status);
    return this;
  }
  
  public withGrade(grade: number): SubmissionBuilder {
    this.grade = Grade.create(grade);
    return this;
  }
  
  public withCreatedAt(createdAt: Date): SubmissionBuilder {
    this.createdAt = createdAt;
    return this;
  }
  
  public build(): Submission {
    return new Submission(
      {
        challengeId: this.challengeId,
        repositoryURL: this.repositoryURL,
        status: this.status,
        grade: this.grade,
        createdAt: this.createdAt
      }, 
      Identifier.create()
    );
  }
  
  public toInput(): SendSubmissionInput {
    return {
      challengeId: this.challengeId.value,
      repositoryURL: this.repositoryURL.getValue(),
      status: this.status.getValue(),
      grade: this.grade.getValue(), 
    };
  }

  validate(): Notification {
    throw new Error("Method not implemented.");
  }
}
