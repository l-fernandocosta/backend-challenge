import { KafkaOptions, Transport } from "@nestjs/microservices";

export const KafkaConfig : KafkaOptions = {
  transport: Transport.KAFKA, 
  options: {
    client: {
      brokers: ['localhost:9092'],
    }, 
    producer: {
      idempotent: true,
    }
  }
}