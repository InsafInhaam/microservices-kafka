import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "email-service",
  brokers: [
    "kafka-broker-1:9092",
    "kafka-broker-2:9092",
    "kafka-broker-3:9092",
  ],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "email-service" });

const run = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({
      topic: "order-successful",
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();
        const { userId, orderId } = JSON.parse(value);

        // TODO: Send email to the user
        const dummyEmailId = "091584203985";
        console.log(`Email consumer: Email sent to user id ${userId}`);

        await producer.send({
          topic: "email-successful",
          messages: [
            { value: JSON.stringify({ userId, emailId: dummyEmailId }) },
          ],
        });
      },
    });
  } catch (error) {
    console.log("Error in analytic service:", error);
  }
};

run();
