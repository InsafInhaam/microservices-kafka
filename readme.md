```markdown
# Kafka Microservices Demo

This project demonstrates a microservices architecture using **KafkaJS** with **Docker Compose**. It includes the following services:

- **Kafka Cluster** (3 brokers)
- **Kafka UI**
- **Payment Service**
- **Order Service**
- **Email Service**
- **Analytics Service**

---

## 🧱 Project Structure
```

.
├── docker-compose.yml
├── payment-service/
├── order-service/
├── email-service/
├── analytic-service/
└── ...

````

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/kafka-microservices-demo.git
cd kafka-microservices-demo
````

---

### 2. Build and Start Services

Make sure Docker is running. Then:

```bash
docker compose up --build
```

> 🔄 First-time build may take a few minutes. It spins up all Kafka brokers and microservices.

---

### 3. Access Services

| Service           | URL                                            |
| ----------------- | ---------------------------------------------- |
| Kafka UI          | [http://localhost:8080](http://localhost:8080) |
| Payment Service   | [http://localhost:4004](http://localhost:4004) |
| Order Service     | [http://localhost:4003](http://localhost:4003) |
| Email Service     | [http://localhost:4002](http://localhost:4002) |
| Analytics Service | [http://localhost:4001](http://localhost:4001) |

---

## 🧠 How It Works

1. **User hits `/payment-service`** – this simulates a payment and sends a Kafka message to `payment-successful` topic.
2. **Order Service listens** to `payment-successful` and publishes `order-successful`.
3. **Email Service listens** to `order-successful` and sends a simulated email, then publishes `email-successful`.
4. **Analytics Service listens** to `email-successful` and logs the result.

---

## 🛠️ Kafka Setup (Docker)

- 3 Kafka brokers using Bitnami's `kafka:latest`
- Kraft mode (no Zookeeper)
- Internal networking with service discovery (hostnames like `kafka-broker-1`)
- Ports `9094`, `9095`, `9096` mapped for external access

---

## 🔁 Kafka Connection Retry Logic

All microservices implement retry logic on Kafka connection using `kafkajs`, to avoid crashes if brokers aren't ready yet.

---

## 🔍 Kafka UI

Use [Kafka UI](https://github.com/provectus/kafka-ui) to inspect topics, messages, and brokers:

```bash
http://localhost:8080
```

---

## 🐳 Docker Tips

- Stop containers:

  ```bash
  docker compose down
  ```

- Rebuild:

  ```bash
  docker compose up --build
  ```

- View logs:

  ```bash
  docker compose logs -f
  ```

---

## 📦 Dependencies

- Node.js
- Express.js
- KafkaJS
- Docker + Docker Compose
- Bitnami Kafka Image
- Kafka UI

---

## 🧪 Test Kafka Flow

```bash
curl -X POST http://localhost:4004/payment-service \
  -H "Content-Type: application/json" \
  -d '{"cart": [{"item": "robot", "qty": 2}]}'
```

Follow the logs:

```bash
docker compose logs -f
```
