export default abstract class UnitUseCase<IN> {
  abstract execute(input: IN): Promise<void>;
}