import { CorrectLessonMessage } from "./KafkaCorrectLessonMessage";

export interface KafkaProducerMessage {
  topic: string; 
  value: CorrectLessonMessage;
}
