import ValueObject from "@/shared/domain/value-objects/IValueObject.vo";

export enum StatusMapper {
  Pending = 'Pending',
  Error = 'Error',
  Done = 'Done',
}

export default class SubmissionStatus extends ValueObject {
  private value: StatusMapper;

  private constructor(status?: StatusMapper) {
    super();
    this.value = StatusMapper[status] ?? StatusMapper.Pending;
  }

  public static create(status?: StatusMapper): SubmissionStatus {
    return new SubmissionStatus(status);
  }
  
  public getValue(): StatusMapper {
    return this.value;
  }

  public static isValid(value: string): boolean {
    const isValid =  Object.values(StatusMapper).includes(value as StatusMapper);
    return isValid;
  }
  
  public isPending(): boolean {
    return this.value === StatusMapper.Pending;
  }

  public isError(): boolean {
    return this.value === StatusMapper.Error;
  }

  public isDone(): boolean {
    return this.value === StatusMapper.Done;
  }

  public static createPending(): SubmissionStatus {
    return new SubmissionStatus(StatusMapper.Pending);
  }

  public static createError(): SubmissionStatus {
    return new SubmissionStatus(StatusMapper.Error);
  }

  public static createDone(): SubmissionStatus {
    return new SubmissionStatus(StatusMapper.Done);
  }

  public static fromString(status: string): SubmissionStatus {
    switch (status) {
      case StatusMapper.Pending:
        return SubmissionStatus.createPending();
      case StatusMapper.Error:
        return SubmissionStatus.createError();
      case StatusMapper.Done:
        return SubmissionStatus.createDone();
      default:
        return SubmissionStatus.createPending();
    }
  }

  public toJSON(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}



