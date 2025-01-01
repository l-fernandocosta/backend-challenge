import { IValidator } from "@/shared/domain/validation/IValidator";
import { Injectable } from "@nestjs/common";

import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, validateSync } from "class-validator";
import { InvalidGradeExceptionMessage } from "../exceptions/InvalidGradeExceptionMessage";
import { InvalidRepositoryURLExceptionMessage } from "../exceptions/InvalidURLExceptionMessage";

import { InvalidUUIDExceptionMessage } from "@/shared/domain/exceptions/InvalidUUIDException";
import Notification from "@/shared/domain/validation/Notification";
import Identifier from "@/shared/domain/value-objects/Identifier.vo";
import Submission from "../SubmissionEntity";
import Grade from "../value-objects/Grade.vo";
import RepositoryURL from "../value-objects/RepositoryURL.vo";
import { StatusMapper } from "../value-objects/SubmissionStatus.vo";

export class SubmissionRules {
  @IsNotEmpty()
  challengeId: Identifier;

  @IsNotEmpty()
  @IsString()
  repositoryURL: string;

  @IsString()
  @IsOptional()
  status: StatusMapper

  @IsNumber()
  @Min(Grade.MIN_GRADE)
  @Max(Grade.MAX_GRADE)
  @IsOptional()
  grade?: number;

  constructor(entity: Submission) {
    this.challengeId = entity.getChallengeId();
    this.repositoryURL = entity.getRepositoryURL().getValue();
    this.status = entity.getStatus().getValue() ?? StatusMapper.Pending;
    this.grade = entity.getGrade()?.getValue();
  }
}


@Injectable()
export default class SubmissionValidator implements IValidator {

  validate(rules: SubmissionRules): Notification {
    const notification = Notification.create();

    const errors = validateSync(rules)

    if (errors.length > 0) {
      errors.forEach(error => {
        const property = error.property
        const constraints = error.constraints

        Object.keys(constraints).forEach(key => {
          notification.addError({ message: constraints[key], property })
        })
      })
    }

    this.validateValueObjects(notification, rules);

    return notification;
  }

  static create(): SubmissionValidator {
    return new SubmissionValidator();
  }

  private validateValueObjects(notification: Notification, input: SubmissionRules): Notification {
    if (input.grade) {
      const isGradeValid = Grade.isValid(input.grade);

      if (!isGradeValid) {
        notification.addError({
          property: 'grade',
          message: InvalidGradeExceptionMessage
        })
      }
    }


    const isRepositoryUrlValid = RepositoryURL.isValidURL(input.repositoryURL);

    if (!isRepositoryUrlValid) {
      notification.addError({
        property: 'repositoryURL',
        message: InvalidRepositoryURLExceptionMessage,
      })
    }

    const isIdentifierValid = Identifier.isValid((input.challengeId as unknown as Identifier).value);

    if (!isIdentifierValid) {
      notification.addError({
        property: 'challengeId',
        message: InvalidUUIDExceptionMessage
      })
    }

    return notification;
  }
}

