import { StatusMapper } from "../value-objects/SubmissionStatus.vo";

export default class SubmissionFilters {
  readonly challengeId?: string;
  readonly dateInit?: Date;
  readonly dateEnd?: Date;
  readonly status?: StatusMapper;

  constructor(challengeId?: string, dateInit?: Date, dateEnd?: Date, status?: StatusMapper) {
    this.challengeId = challengeId;
    this.dateInit = dateInit;
    this.dateEnd = dateEnd;
    this.status = status;
  }

  static create(filters: { challengeId?: string, dateInit?: Date, dateEnd?: Date, status?: StatusMapper }): SubmissionFilters {
    return new SubmissionFilters(filters.challengeId, filters.dateInit, filters.dateEnd, filters.status);
  }

  toPrismaQuery() {
    const query: any = {};

    if (this.challengeId) {
      query.challengeId = this.challengeId;
    }

    if (this.dateInit) {
      query.createdAt = {
        gte: new Date(this.dateInit.setHours(0, 0, 0, 0))
      };
    }

    if (this.dateEnd) {
      query.createdAt = {
        ...query.createdAt,
        lte: new Date(this.dateEnd.setHours(23, 59, 59, 999))
      };
    }

    if (this.status) {
      query.status = this.status;
    }

    return query;
  }
}