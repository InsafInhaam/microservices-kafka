import express from "express";
import cors from "cors";
import { Kafka } from "kafkajs";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: [
    "kafka-broker-1:9092",
    "kafka-broker-2:9092",
    "kafka-broker-3:9092",
  ],
});

const producer = kafka.producer();

const connectToKafka = async () => {
  const maxRetries = 10;
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      await producer.connect();
      console.log("✅ Connected to Kafka successfully");
      return;
    } catch (error) {
      console.log(
        `❌ Kafka connection failed (attempt ${attempt + 1}): ${error.message}`
      );
      attempt++;
      await new Promise((res) => setTimeout(res, 3000)); // wait 3 seconds
    }
  }
  console.error("❌ Could not connect to Kafka after multiple attempts.");
};

app.get("/", (req, res) => {
  res.send("Payment Service is running");
});

app.post("/payment-service", async (req, res) => {
  const { cart } = req.body;
  // ASSUME THAT WE GET THE COOKIE AND DECRYPT THE USER ID
  const userId = Math.floor(Math.random() * 10000); // Simulating user ID from cookie

  // TODO:PAYMENT

  // KAFKA
  await producer.send({
    topic: "payment-successful",
    messages: [{ value: JSON.stringify({ userId, cart }) }],
  });

  console.log("Payment successful for user:", userId);

  setTimeout(() => {
    return res.status(200).send("Payment successful");
  }, 3000);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  connectToKafka();
  console.log(`Payment service is running on port ${PORT}`);
});
