import ChallengeFilters from "../persistence/ChallengeFilters";

describe('ChallengeFilters', () => {
  describe('constructor', () => {
    it('should create an instance with no filters', () => {
      const filters = new ChallengeFilters();
      expect(filters.title).toBeUndefined();
      expect(filters.description).toBeUndefined();
    });

    it('should create an instance with title filter', () => {
      const filters = new ChallengeFilters('Test Title');
      expect(filters.title).toBe('Test Title');
      expect(filters.description).toBeUndefined();
    });

    it('should create an instance with description filter', () => {
      const filters = new ChallengeFilters(undefined, 'Test Description');
      expect(filters.title).toBeUndefined();
      expect(filters.description).toBe('Test Description');
    });

    it('should create an instance with both title and description filters', () => {
      const filters = new ChallengeFilters('Test Title', 'Test Description');
      expect(filters.title).toBe('Test Title');
      expect(filters.description).toBe('Test Description');
    });
  });

  describe('create', () => {
    it('should create an instance with the provided filters', () => {
      const filters = ChallengeFilters.create({ title: 'Test Title', description: 'Test Description' });
      expect(filters.title).toBe('Test Title');
      expect(filters.description).toBe('Test Description');
    });

    it('should create an instance with empty filters', () => {
      const filters = ChallengeFilters.create({});
      expect(filters.title).toBeUndefined();
      expect(filters.description).toBeUndefined();
    });
  });

  describe('toPrismaQuery', () => {
    it('should return an empty object when no filters are set', () => {
      const filters = new ChallengeFilters();
      const query = filters.toPrismaQuery();
      expect(query).toEqual({});
    });

    it('should return query with title filter when title is set', () => {
      const filters = new ChallengeFilters('Test Title');
      const query = filters.toPrismaQuery();
      expect(query).toEqual({
        title: { contains: 'Test Title', mode: 'insensitive' },
      });
    });

    it('should return query with description filter when description is set', () => {
      const filters = new ChallengeFilters(undefined, 'Test Description');
      const query = filters.toPrismaQuery();
      expect(query).toEqual({
        description: { contains: 'Test Description', mode: 'insensitive' },
      });
    });

    it('should return query with both title and description filters', () => {
      const filters = new ChallengeFilters('Test Title', 'Test Description');
      const query = filters.toPrismaQuery();
      expect(query).toEqual({
        title: { contains: 'Test Title', mode: 'insensitive' },
        description: { contains: 'Test Description', mode: 'insensitive' },
      });
    });
  });
});
