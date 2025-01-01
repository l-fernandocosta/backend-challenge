import SubmissionRepository from "@/core/submission/domain/persistence/SubmissionRepository";
import Submission from "@/core/submission/domain/SubmissionEntity";
import SendSubmissionInput from "@/core/submission/infra/graphql/input/SendSubmissionInput";
import UseCase from "@/shared/application/usecases/UseCase";
import InvalidDomainException from "@/shared/domain/exceptions/InvalidDomainException";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class SendSubmissionUseCase implements UseCase<SendSubmissionInput, Submission> {
  constructor(
    private readonly submissionRepository: SubmissionRepository
  ) { }

  async execute(input: SendSubmissionInput): Promise<Submission> {
    const submission = Submission.fromInput(input);

    const notification = submission.validate();

    if (notification.hasError()) {
      throw new InvalidDomainException({
        validationErrors: notification.getErrors()
      });
    }

    return this.submissionRepository.send(submission);
  }

}