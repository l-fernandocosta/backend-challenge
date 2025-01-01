import Submission from "@/core/submission/domain/SubmissionEntity";
import Entity from "@/shared/domain/Entity";
import Notification from "@/shared/domain/validation/Notification";
import Identifier from "@/shared/domain/value-objects/Identifier.vo";
import ChallengeValidator, { ChallengeRules } from "./validation/ChallengeValidator";

export interface ChallengeConstructorProps {
  title: string;
  description: string;
  createdAt?: Date;
}

export default class Challenge extends Entity {
  private title: string;
  private description: string;
  private createdAt: Date | undefined;

  constructor(props: ChallengeConstructorProps, id?: Identifier) {
    super(id);
    this.title = props.title;
    this.description = props.description;
    this.createdAt = props.createdAt || new Date();
    this.validate();
  }

  public validate(): Notification {
    const validator = ChallengeValidator.create();
    const rules: ChallengeRules = new ChallengeRules(this);
    return validator.validate(rules);
  }

  public getTitle(): string {
    return this.title;
  }

  public setTitle(value: string) {
    this.title = value;
    this.validate();
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(value: string) {
    this.description = value;
    this.validate();
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  static create(props: ChallengeConstructorProps, id?: Identifier): Challenge {
    return new Challenge(props, id);
  }

  public toJSON() {
    return {
      id: this.id.value,
      title: this.title,
      description: this.description,
      createdAt: this.createdAt
    }
  }

}