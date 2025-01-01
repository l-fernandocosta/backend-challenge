export default abstract class NullaryUseCase {
  abstract execute(): Promise<void>;
}