import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "order-service",
  brokers: [
    "kafka-broker-1:9092",
    "kafka-broker-2:9092",
    "kafka-broker-3:9092",
  ],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "order-service" });

const run = async () => {
  let attempts = 0;
  const maxRetries = 10;

  while (attempts < maxRetries) {
    try {
      await producer.connect();
      await consumer.connect();
      await consumer.subscribe({
        topic: "payment-successful",
        fromBeginning: true,
      });

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value.toString();
          const { userId, cart } = JSON.parse(value);

          // TODO: Create order on DB
          const dummyOrderId = "123456789";
          console.log(`Order consumer: Order created for user id: ${userId}`);

          await producer.send({
            topic: "order-successful",
            messages: [
              { value: JSON.stringify({ userId, orderId: dummyOrderId }) },
            ],
          });
        },
      });
      break;
    } catch (error) {
      console.log(
        `❌ Kafka connection attempt ${attempts + 1} failed:`,
        error.message
      );
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3s
    }
  }
};

run();
