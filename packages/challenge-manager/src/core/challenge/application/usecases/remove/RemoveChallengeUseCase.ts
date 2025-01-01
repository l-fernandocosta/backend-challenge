import ChallengeRepository from "@/core/challenge/domain/persistence/ChallengeRepository";
import UnitUseCase from "@/shared/application/usecases/UnitUseCase";
import Identifier from "@/shared/domain/value-objects/Identifier.vo";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class RemoveChallengeUseCase implements UnitUseCase<Identifier> {
  constructor(
    private readonly repository: ChallengeRepository
  ){}

  async execute(identifier: Identifier): Promise<void> {
    await this.repository.delete(identifier);
  } 
}