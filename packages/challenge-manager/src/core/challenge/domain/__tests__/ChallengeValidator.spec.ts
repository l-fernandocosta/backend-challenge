import Challenge from "../ChallengeEntity";
import ChallengeValidator, { ChallengeRules } from "../validation/ChallengeValidator";

describe("ChallengeValidator", () => {
  let validator: ChallengeValidator;

  beforeEach(() => {
    validator = new ChallengeValidator();
  });

  it("should return a valid notification when properties are valid", () => {
    const validProps = {
      title: "Valid Title",
      description: "Valid Description",
    };
    const challenge: Challenge = Challenge.create(validProps);
    const rules = new ChallengeRules(challenge);
    const notification = validator.validate(rules);

    expect(notification.hasError()).toBe(false);
    expect(notification.getErrors()).toHaveLength(0);
  });

  it("should return errors when title is empty", () => {
    const invalidProps = {
      title: "",
      description: "Valid Description",
    };

    const challenge = Challenge.create(invalidProps);
    const rules = new ChallengeRules(challenge);
    const notification = validator.validate(rules);

    expect(notification.hasError()).toBe(true);
    expect(notification.getErrors()).toHaveLength(2);
    expect(notification.getFirstError().property).toBe("title");
    expect(notification.getFirstError().message).toBe("title must be longer than or equal to 1 characters");
  });

  it("should return errors when description is empty", () => {
    const invalidProps = {
      title: "Valid Title",
      description: "",
    };

    const challenge = Challenge.create(invalidProps);
    const rules = new ChallengeRules(challenge);
    const notification = validator.validate(rules);

    expect(notification.hasError()).toBe(true);
    expect(notification.getErrors()).toHaveLength(2);
    expect(notification.getFirstError().property).toBe("description");
    expect(notification.getFirstError().message).toBe("description must be longer than or equal to 1 characters");
  });

  it("should return errors when both title and description are invalid", () => {
    const invalidProps = {
      title: "",
      description: "",
    };

    const challenge = Challenge.create(invalidProps);
    const rules = new ChallengeRules(challenge);
    const notification = validator.validate(rules);

    expect(notification.hasError()).toBe(true);
    expect(notification.getErrors()).toHaveLength(4);
    const errors = notification.getErrors();

    expect(errors).toEqual(
      expect.arrayContaining([
        { property: "title", message: "title must be longer than or equal to 1 characters" },
        { property: "description", message: "description should not be empty" },
      ])
    );
  });

  it("should return errors for properties with invalid types", () => {
    const invalidProps = {
      title: 123,
      description: {},
    } as any;

    const rules = new ChallengeRules(invalidProps);
    const notification = validator.validate(rules);

    expect(notification.hasError()).toBe(true);
    expect(notification.getErrors()).toHaveLength(4);
    const errors = notification.getErrors();

    expect(errors).toEqual(
      expect.arrayContaining([
        { property: "title", message: "title must be a string" },
        { property: "description", message: "description must be a string" },
      ])
    );
  });

  it("should return errors when title does not meet minimum length", () => {
    const invalidProps = {
      title: "",
      description: "Valid Description",
    };

    const challenge = Challenge.create(invalidProps);
    const rules = new ChallengeRules(challenge);
    const notification = validator.validate(rules);

    expect(notification.hasError()).toBe(true);
    expect(notification.getErrors()).toHaveLength(2);
    expect(notification.getFirstError().property).toBe("title");
    expect(notification.getFirstError().message).toBe("title must be longer than or equal to 1 characters");
  });
});
