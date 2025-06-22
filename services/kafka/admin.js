import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka-service",
  brokers: [
    "kafka-broker-1:9092",
    "kafka-broker-2:9092",
    "kafka-broker-3:9092",
  ],
});

const admin = kafka.admin();

const run = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [
      {
        topic: "payment-successful",
      },
      {
        topic: "order-successful",
      },
      {
        topic: "email-successful",
      },
    ],
  });
};

run();
