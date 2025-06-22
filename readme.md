# 🚀 Kafka Microservices Demo

```markdown
This project demonstrates a **microservices architecture** using **KafkaJS** and **Docker Compose**. It includes the following services:

- ⚙️ Kafka Cluster (3 Brokers - KRaft mode, no Zookeeper)
- 📊 Kafka UI (Inspect topics, brokers, messages)
- 💳 Payment Service
- 📦 Order Service
- 📧 Email Service
- 📈 Analytics Service

```
---

## 🧱 Project 

```
kafka-microservices-demo/
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

Ensure Docker is installed and running. Then run:

```bash
docker compose up --build
```

> ⏳ The first-time build might take a few minutes as it pulls Kafka and builds services.

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

## 🔄 How the System Works

1. **User triggers a payment** via `POST /payment-service`.
2. **Payment Service** sends a Kafka message to the `payment-successful` topic.
3. **Order Service** listens to `payment-successful` and sends `order-successful`.
4. **Email Service** listens to `order-successful`, simulates sending an email, and emits `email-successful`.
5. **Analytics Service** listens to `email-successful` and logs the final result.

Each step is event-driven and loosely coupled using Kafka topics.

---

## 🛠️ Kafka Setup

* **Image:** Bitnami's `kafka:latest`
* **Mode:** KRaft (no Zookeeper)
* **Brokers:** 3 Kafka brokers with IDs 1–3
* **Ports:** `9094`, `9095`, `9096` mapped externally
* **Internal Networking:** Each service refers to brokers using hostnames like `kafka-broker-1`

---

## 🔁 Kafka Connection Retry Logic

All microservices use **KafkaJS** with built-in **retry logic** to avoid crashes when brokers aren't ready. This ensures each service will retry connecting until Kafka becomes available.

---

## 🔍 Kafka UI

You can inspect Kafka topics, partitions, messages, and consumers using Kafka UI.

* 📍 Open [http://localhost:8080](http://localhost:8080)

---

## 📦 Tech Stack

* **Node.js** + **Express.js** for services
* **KafkaJS** for Kafka client in Node.js
* **Docker Compose** for orchestrating services
* **Bitnami Kafka** for a KRaft-based Kafka cluster
* **Kafka UI** by Provectus

---

## 🧪 Test the Kafka Flow

Trigger the flow manually using `curl`:

```bash
curl -X POST http://localhost:4004/payment-service \
  -H "Content-Type: application/json" \
  -d '{"cart": [{"item": "robot", "qty": 2}]}'
```

Then monitor the logs:

```bash
docker compose logs -f
```

You should see logs from all services as they receive and process Kafka messages.

---

## 🐳 Docker Tips

* **Stop all containers:**

  ```bash
  docker compose down
  ```

* **Rebuild everything:**

  ```bash
  docker compose up --build
  ```

* **View real-time logs:**

  ```bash
  docker compose logs -f
  ```

---

## 🙌 Contributing

Feel free to fork the repo, raise issues, or submit PRs to improve the architecture or add new services.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---