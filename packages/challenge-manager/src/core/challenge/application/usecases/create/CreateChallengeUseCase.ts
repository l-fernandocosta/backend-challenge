import Challenge from "@/core/challenge/domain/ChallengeEntity";
import ChallengeRepository from "@/core/challenge/domain/persistence/ChallengeRepository";
import InvalidDomainException from "@/shared/domain/exceptions/InvalidDomainException";

import { CreateChallengeInput } from "@/core/challenge/infra/graphql/input/CreateChallengeInput";
import UseCase from "@/shared/application/usecases/UseCase";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class CreateChallengeUseCase implements UseCase<CreateChallengeInput, Challenge> {
  constructor(private readonly repository: ChallengeRepository) {
  };

  async execute(input: CreateChallengeInput): Promise<Challenge> {
    const challenge = Challenge.create({
      title: input.title,
      description: input.description,
    });
    
    const challengeValidation = challenge.validate();

    if (challengeValidation.getErrors().length) {
      throw new InvalidDomainException({ validationErrors: challengeValidation.getErrors() });
    }

    return await this.repository.create(challenge);
  }
}