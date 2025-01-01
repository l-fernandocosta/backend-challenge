import PrismaService from "@/core/challenge/infra/persistence/prisma/PrismaClient";
import KafkaProducerService from "@/shared/infra/kafka/producer/KafkaProducerService";
import { Module, Provider } from "@nestjs/common";
import ListSubmissionsUseCase from "../application/usecases/list/LIstSubmissionsUseCase";
import SendSubmissionUseCase from "../application/usecases/send/SendSubmissionUseCase";
import { SubmissionResolver } from "./graphql/SubmissionResolver";
import PrismaSubmissionRepositoryImpl from "./persistence/prisma/PrismaSubmissionRepositoryImpl";
import SubmissionRepository from "../domain/persistence/SubmissionRepository";

const RepositoryProvider: Provider ={
  provide: SubmissionRepository, 
  useClass: PrismaSubmissionRepositoryImpl
}

@Module({
  providers: [
    SubmissionResolver, 
    SendSubmissionUseCase, 
    ListSubmissionsUseCase,
    RepositoryProvider,  
    KafkaProducerService, 
    PrismaService, 
  ], 
  exports: [SubmissionResolver, RepositoryProvider]
})
export default class SubmissionModule { };