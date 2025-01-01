export default abstract class UseCase<IN, OUT> {
  abstract execute(input: IN): Promise<OUT>;
}