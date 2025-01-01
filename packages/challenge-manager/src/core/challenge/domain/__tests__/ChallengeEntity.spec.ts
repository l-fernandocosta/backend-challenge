import Challenge from '@/core/challenge/domain/ChallengeEntity';
import ChallengeValidator from '@/core/challenge/domain/validation/ChallengeValidator';
import Notification from '@/shared/domain/validation/Notification';
import Identifier from '@/shared/domain/value-objects/Identifier.vo';

jest.mock('../validation/ChallengeValidator');
const MockValidator = ChallengeValidator as jest.Mocked<typeof ChallengeValidator>;

describe('Challenge', () => {

  beforeEach(() => {
    const mockValidatorInstance = {
      validate: jest.fn().mockReturnValue(Notification.create()),
    };
    
    MockValidator.create.mockReturnValue(mockValidatorInstance);
    
    MockValidator.create.mockClear();
    
  });

  it('should create a Challenge with valid properties', () => {
    const validProps = {
      title: 'Valid Title',
      description: 'Valid Description',
      createdAt: new Date(),
    };

    const challenge = new Challenge(validProps);

    expect(challenge).toBeInstanceOf(Challenge);
    expect(challenge.getTitle()).toBe(validProps.title);
    expect(challenge.getDescription()).toBe(validProps.description);
    expect(challenge.getCreatedAt()).toBe(validProps.createdAt);
  });

  it('should validate the Challenge and return errors if properties are invalid', () => {
    const invalidProps = {
      title: '',
      description: '',
    };

    const challenge = new Challenge(invalidProps);
    const mockNotification = Notification.create();

    mockNotification.addError({ property: 'title', message: 'Title cannot be empty' });
    mockNotification.addError({ property: 'description', message: 'Description cannot be empty' });

    MockValidator.create.mockReturnValue({
      validate: jest.fn().mockReturnValue(mockNotification),
    });

    const notification = challenge.validate();

    expect(notification.hasError()).toBe(true);
    expect(notification.getErrors()[0].message).toBe('Title cannot be empty');
    expect(notification.getErrors()[1].message).toBe('Description cannot be empty');
  });

  it('should call the validator when setting title and description', () => {
    const validProps = {
      title: 'Valid Title',
      description: 'Valid Description',
    };

    const challenge = new Challenge(validProps);
    
    const mockNotification = Notification.create();

    MockValidator.create.mockReturnValue({
      validate: jest.fn().mockReturnValue(mockNotification),
    });

    challenge.setTitle('New title');
    challenge.setDescription('New Description');

    expect(MockValidator.create).toHaveBeenCalledTimes(3);
    
  });

  it('should create a Challenge with a custom identifier', () => {
    const validProps = {
      title: 'Custom ID Title',
      description: 'Valid Description',
    };

    const customId = Identifier.create();
    const challenge = new Challenge(validProps, customId);

    expect(challenge).toBeInstanceOf(Challenge);
    expect(challenge.getTitle()).toBe(validProps.title);
    expect(challenge.getDescription()).toBe(validProps.description);
  });

  it('should return errors from the validator if validation fails on title change', () => {
    const validProps = {
      title: 'Initial Title',
      description: 'Valid Description',
    };

    const challenge = new Challenge(validProps);

    const mockNotification = Notification.create();
    mockNotification.addError({ property: 'title', message: 'Title is invalid' });

    MockValidator.create.mockReturnValue({
      validate: jest.fn().mockReturnValue(mockNotification),
    });

    challenge.setTitle('');

    const notification = challenge.validate();

    expect(notification.hasError()).toBe(true);
    expect(notification.getErrors()).toHaveLength(1);
    expect(notification.getFirstError().message).toBe('Title is invalid');
  });
});
