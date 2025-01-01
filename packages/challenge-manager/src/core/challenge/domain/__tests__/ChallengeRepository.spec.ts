import AppError from '@/shared/domain/exceptions/AppError';
import PaginationParams from '@/shared/domain/common/PaginationParams';
import Identifier from '@/shared/domain/value-objects/Identifier.vo';
import Challenge from '../ChallengeEntity';
import ChallengeFilters from '../persistence/ChallengeFilters';
import { MockChallengeRepository } from '../persistence/MockChallengeRepository';

describe('ChallengeRepository', () => {
  let repository: MockChallengeRepository;

  beforeEach(() => {
    repository = new MockChallengeRepository();
  });

  describe('create', () => {
    it('should create a new challenge', async () => {
      const challenge = Challenge.create(
        {
          title: 'Test Challenge',
          description: 'Test Description',
        },
        Identifier.create()
      );

      const createdChallenge = await repository.create(challenge);

      expect(createdChallenge).toEqual(challenge);
    });
  });

  describe('update', () => {
    it('should update an existing challenge', async () => {
      const identifier = Identifier.create();

      const challenge = Challenge.create({
        title: 'Test Challenge',
        description: 'Test Description',
      }, identifier);

      await repository.create(challenge);

      const updatedChallenge = Challenge.create(
        {
          title: 'Updated Challenge',
          description: 'Updated Description',
        },
        identifier
      );

      const result = await repository.update(updatedChallenge);

      expect(result).toEqual(updatedChallenge);
    });

    it('should throw an error if challenge does not exist', async () => {
      const challenge = Challenge.create(
        {
          title: 'Test Challenge',
          description: 'Test Description',
        },
        Identifier.create()
      );

      await expect(repository.update(challenge)).rejects.toThrow(AppError);
    });
  });

  describe('delete', () => {
    it('should delete an existing challenge', async () => {
      const identifier = Identifier.create();

      const challenge = Challenge.create(
        {
          description: 'Test Description',
          title: 'Test Challenge',
        },
        identifier
      );

      await repository.create(challenge);

      await repository.delete(identifier);

      const challenges = await repository.list(undefined, PaginationParams.create({
        page: 1,
        perPage: 10
      }));

      expect(challenges.data).toHaveLength(0);
    });

    it('should throw an error if challenge does not exist', async () => {
      await expect(repository.delete(Identifier.create())).rejects.toThrow(AppError);
    });
  });
  describe('list', () => {
    it('should list all challenges without filters', async () => {
      const challenge1 = new Challenge(
        {
          title: 'Challenge 1',
          description: 'Description 1',
        },
        Identifier.create()
      );

      const challenge2 = new Challenge(
        {
          title: 'Challenge 2',
          description: 'Description 2',
        },
        Identifier.create()
      );

      await repository.create(challenge1);
      await repository.create(challenge2);

      const pagination = new PaginationParams(1, 10);
      const result = await repository.list(undefined, pagination);

      expect(result.data).toHaveLength(2);
      expect(result.totalItems).toBe(2);
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(1);
    });

    it('should apply filters and return matching challenges', async () => {
      const challenge1 = new Challenge(
        {
          title: 'Challenge 1',
          description: 'Description 1',
        },
        Identifier.create()
      );

      const challenge2 = new Challenge(
        {
          title: 'Challenge 2',
          description: 'Description 2',
        },
        Identifier.create()
      );

      await repository.create(challenge1);
      await repository.create(challenge2);

      const filters = ChallengeFilters.create({ title: 'Challenge 1' });
      const pagination = new PaginationParams(1, 10);

      const result = await repository.list(filters, pagination);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].getTitle()).toBe('Challenge 1');
    });

  });
});

