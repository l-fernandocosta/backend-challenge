import ChallengeRepository from './ChallengeRepository';
import Challenge from '../ChallengeEntity';
import Identifier from '@/shared/domain/value-objects/Identifier.vo';
import ChallengeFilters from './ChallengeFilters';
import PaginationParams from '@/shared/domain/common/PaginationParams';
import PaginatedResult from '@/shared/domain/common/PaginatedResult';
import AppError from '@/shared/domain/exceptions/AppError';
import { HttpStatus } from '@nestjs/common';

class MockChallengeRepository extends ChallengeRepository {
  private challenges: Challenge[] = [];

  async create(challenge: Challenge): Promise<Challenge> {
    this.challenges.push(challenge);
    return challenge;
  }

  async update(challenge: Challenge): Promise<Challenge> {
    const index = this.challenges.findIndex(c => c.id.value === challenge.id.value);
    if (index === -1) {
      throw new AppError({
        message: `Challenge with id ${challenge.id.value} not found`,
        statusCode: HttpStatus.NOT_FOUND
      });
    }
    this.challenges[index] = challenge;
    return challenge;
  }

  async delete(challengeId: Identifier): Promise<void> {
    const index = this.challenges.findIndex(c => c.id.value === challengeId.value);

    if (index === -1) {
      throw new AppError({
        message: `Challenge with id ${challengeId.value} not found`,
        statusCode: HttpStatus.NOT_FOUND
      })
    };
    
    this.challenges.splice(index, 1);
  }

  async list(
    filters?: ChallengeFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Challenge>> {
    let filteredChallenges = this.challenges;

    if (filters) {
      if (filters.title) {
        filteredChallenges = filteredChallenges.filter(c =>
          c.getTitle().toLowerCase().includes(filters.title.toLowerCase())
        );
      }
      if (filters.description) {
        filteredChallenges = filteredChallenges.filter(c =>
          c.getDescription().toLowerCase().includes(filters.description.toLowerCase())
        );
      }
    }

    const totalItems = filteredChallenges.length;
    const start = pagination ? (pagination.page - 1) * pagination.perPage : 0;
    const end = pagination ? start + pagination.perPage : totalItems;

    return PaginatedResult.create(filteredChallenges.slice(start, end), totalItems, pagination);
  }
}

export { MockChallengeRepository };
