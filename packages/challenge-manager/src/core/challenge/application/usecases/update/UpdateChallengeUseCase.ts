import Challenge from "@/core/challenge/domain/ChallengeEntity";
import ChallengeRepository from "@/core/challenge/domain/persistence/ChallengeRepository";
import { UpdateChallengeInput } from "@/core/challenge/infra/graphql/input/UpdateChallengeInput";
import UseCase from "@/shared/application/usecases/UseCase";
import InvalidDomainException from "@/shared/domain/exceptions/InvalidDomainException";
import Identifier from "@/shared/domain/value-objects/Identifier.vo";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class UpdateChallengeUseCase implements UseCase<UpdateChallengeInput, Challenge> {
  constructor(
    private readonly repository: ChallengeRepository
  ){}

  async execute(input: UpdateChallengeInput): Promise<Challenge> {
    const challenge = Challenge.create({
      title: input.title,
      description: input.description,
    }, Identifier.from(input.id));

    const validator = challenge.validate();

    if (validator.getErrors().length) {
      throw new InvalidDomainException({ validationErrors: validator.getErrors() });
    }

    return await this.repository.update(challenge);
  }

}