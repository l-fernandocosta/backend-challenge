import { Module, Provider } from "@nestjs/common";
import CreateChallengeUseCase from "../application/usecases/create/CreateChallengeUseCase";
import ListChallengesUseCase from "../application/usecases/list/ListChallengesUseCase";
import RemoveChallengeUseCase from "../application/usecases/remove/RemoveChallengeUseCase";
import UpdateChallengeUseCase from "../application/usecases/update/UpdateChallengeUseCase";
import ChallengeRepository from "../domain/persistence/ChallengeRepository";
import { ChallengeResolver } from "./graphql/ChallengeResolver";
import PrismaChallengeReposityImpl from "./persistence/prisma/PrismaChallengeRepositoryImpl";
import PrismaService from "./persistence/prisma/PrismaClient";

const ChallengeRepositoryProvider : Provider = {
  provide: ChallengeRepository, 
  useClass: PrismaChallengeReposityImpl,
}

@Module({
  providers: [
    ChallengeResolver, 
    CreateChallengeUseCase, 
    ListChallengesUseCase, 
    RemoveChallengeUseCase,
    UpdateChallengeUseCase, 
    ChallengeRepositoryProvider, 
    PrismaService,     
  ], 
  exports: [ChallengeResolver, ChallengeRepositoryProvider], 
})
export default class ChallengeModule {};