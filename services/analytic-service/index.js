import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "analytic-service",
  brokers: [
    "kafka-broker-1:9092",
    "kafka-broker-2:9092",
    "kafka-broker-3:9092",
  ],
});

const consumer = kafka.consumer({ groupId: "analytic-service" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const run = async () => {
  const maxRetries = 10;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      await consumer.connect();
      console.log("✅ Analytic consumer connected to Kafka");

      await consumer.subscribe({
        topics: ["payment-successful", "order-successful", "email-successful"],
        fromBeginning: true,
      });

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          switch (topic) {
            case "payment-successful":
              {
                const value = message.value.toString();
                const { userId, cart } = JSON.parse(value);

                const total = cart
                  .reduce((acc, item) => acc + item.price, 0)
                  .toFixed(2);

                console.log(`Analytic consumer user: ${userId} paid ${total}`);
              }
              break;
            case "order-successful":
              {
                const value = message.value.toString();
                const { userId, orderId } = JSON.parse(value);

                console.log(
                  `Analytic consumer: Order id ${orderId} created for user id ${userId}`
                );
              }
              break;
            case "email-successful":
              {
                const value = message.value.toString();
                const { userId, emailId } = JSON.parse(value);

                console.log(
                  `Analytic consumer: Email id ${emailId} sent to user id ${userId}`
                );
              }
              break;
            default:
              break;
          }
        },
      });

      break;
    } catch (error) {
      attempts++;
      console.error(
        `❌ Failed to connect to Kafka (attempt ${attempt}/${maxRetries})`
      );
      console.error("Error in analytic service:", error);

      if (attempts >= maxRetries) {
        console.error("Max retries reached. Exiting...");
        process.exit(1);
      }

      await sleep(5000);
    }
  }
};

run();
