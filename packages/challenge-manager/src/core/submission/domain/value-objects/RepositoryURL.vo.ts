import ValueObject from "@/shared/domain/value-objects/IValueObject.vo";

export default class RepositoryURL extends ValueObject {
  private value: string;
  private static readonly GITHUB_REGEX = /^https:\/\/github\.com\/.+\/.+$/;

  constructor(url: string) {
    super();
    this.value = url;
    RepositoryURL.isValidURL(this.value);
  }

  public static isValidURL(url: string): boolean {
    const githubRegex = new RegExp(RepositoryURL.GITHUB_REGEX);
    const isOk = githubRegex.test(url);
    return isOk;
  }

  public getValue(): string {
    return this.value;
  }

  public static create(url: string): RepositoryURL {
    return new RepositoryURL(url);
  }

  public toJSON(): string{
    return this.value;
  }
}
