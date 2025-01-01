import Challenge from "../ChallengeEntity";
import Notification from "@/shared/domain/validation/Notification";

import { IValidator } from "@/shared/domain/validation/IValidator";
import { Injectable } from "@nestjs/common";
import { IsString, IsNotEmpty, MinLength, validateSync } from 'class-validator'


export class ChallengeRules {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  description: string;

  constructor(props: Challenge) {
    Object.assign(this, props)
  }
}

@Injectable()
export default class ChallengeValidator implements IValidator {
  validate(entity: ChallengeRules): Notification {
    const notification = Notification.create();

    const errors = validateSync(entity)

    if (errors.length > 0) {
      errors.forEach(error => {
        const property = error.property
        const constraints = error.constraints

        Object.keys(constraints).forEach(key => {
          notification.addError({ message: constraints[key], property })
        })
      })
    }
    return notification;
  }

  static create(): ChallengeValidator {
    return new ChallengeValidator()
  }

}