import KafkaHelper from "../common/KafkaHelpers";

import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka, Partitioners, Producer } from "kafkajs";
import { KafkaProducerMessage } from "./KafakProducerMessage";
import { CorrectLessonMessage } from "./KafkaCorrectLessonMessage";

@Injectable()
export default class KafkaProducerService implements OnModuleInit {
  private kafka: Kafka;
  private producer: Producer;

  async onModuleInit() {
    this.kafka = new Kafka({
      clientId: KafkaHelper.CLIENT_ID,
      brokers: ['localhost:9092'],
    })

    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
      idempotent: true,

    });

    await this.producer.connect()
  }

  async sendMessage(topic: string, message: CorrectLessonMessage): Promise<void> {
    const kafkaMessage: KafkaProducerMessage = {
      topic,
      value: message,
    };

    await this.producer.send({
      topic: kafkaMessage.topic,
      messages: [
        {
          value: JSON.stringify(kafkaMessage.value),
        },
      ],
    });

  }
}