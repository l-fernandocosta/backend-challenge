import SubmissionFilters from '../persistence/SubmissionFIlters';
import { StatusMapper } from '../value-objects/SubmissionStatus.vo';

describe('SubmissionFilters', () => {
  it('should create filters with no parameters', () => {
    const filters = new SubmissionFilters();

    expect(filters.challengeId).toBeUndefined();
    expect(filters.dateInit).toBeUndefined();
    expect(filters.dateEnd).toBeUndefined();
    expect(filters.status).toBeUndefined();
  });

  it('should create filters with custom parameters', () => {
    const filters = new SubmissionFilters(
      'challenge-id',
      new Date('2023-01-01'),
      new Date('2023-12-31'),
      StatusMapper.Pending
    );

    expect(filters.challengeId).toBe('challenge-id');
    expect(filters.dateInit).toEqual(new Date('2023-01-01'));
    expect(filters.dateEnd).toEqual(new Date('2023-12-31'));
    expect(filters.status).toBe(StatusMapper.Pending);
  });

  it('should correctly create a filter using the static create method', () => {
    const filters = SubmissionFilters.create({
      challengeId: 'challenge-id',
      dateInit: new Date('2023-01-01'),
      dateEnd: new Date('2023-12-31'),
      status: StatusMapper.Done
    });

    expect(filters.challengeId).toBe('challenge-id');
    expect(filters.dateInit).toEqual(new Date('2023-01-01'));
    expect(filters.dateEnd).toEqual(new Date('2023-12-31'));
    expect(filters.status).toBe(StatusMapper.Done);
  });

  it('should generate Prisma query with only some filters', () => {
    const filters = new SubmissionFilters(
      'challenge-id',
      undefined,
      new Date('2023-12-31'),
      undefined
    );

    const query = filters.toPrismaQuery();

    expect(query.challengeId).toBe('challenge-id');
    expect(query.createdAt.lte).toBeInstanceOf(Date);
    expect(query.status).toBeUndefined();
  });

  it('should return an empty Prisma query when no filters are set', () => {
    const filters = new SubmissionFilters();
    const query = filters.toPrismaQuery();

    expect(query).toEqual({});
  });
});
