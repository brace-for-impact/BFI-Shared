import { Kafka, Message, Producer, Consumer, EachMessagePayload } from 'kafkajs';

const RETRY_DELAY_MS = 3000;
const MAX_RETRIES = 5;

let kafkaProducer: Producer | null = null;
let kafkaConsumer: Consumer | null = null;
let isConnected = false;

export const send = async ({ topic, messages }: { topic: string; messages: Message[] }) => {
  if (!kafkaProducer) throw new Error('Kafka producer not initialized');
  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      await kafkaProducer.send({ topic, messages });
      return;
    } catch (error) {
      attempt++;
      console.error(`[Kafka Producer] Error (attempt ${attempt}):`, error);
      if (attempt >= MAX_RETRIES) throw error;
      await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
    }
  }
};

export const consume = async ({
  topics,
  onMessage,
}: {
  topics: string[];
  onMessage: (payload: EachMessagePayload) => Promise<void>;
}) => {
  const consumer = kafkaConsumer;
  if (!consumer) {
    throw new Error('Kafka consumer not initialized');
  }

  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
  }

  const runConsumer = async () => {
    try {
      await consumer.run({
        eachMessage: async (payload) => {
          try {
            await onMessage(payload);
          } catch (err) {
            console.error('[Kafka Consumer] Error in message:', err);
          }
        },
      });
    } catch (err) {
      console.error('[Kafka Consumer] Error running consumer:', err);
      await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
      await runConsumer();
    }
  };

  await runConsumer();
};


export const initKafka = async ({
  clientId,
  brokers,
  groupId,
}: {
  clientId: string;
  brokers: string[];
  groupId: string;
}) => {
  if (isConnected) return; // already initialized

  const kafka = new Kafka({ clientId, brokers });
  kafkaProducer = kafka.producer();
  kafkaConsumer = kafka.consumer({ groupId });

  await kafkaProducer.connect().then(() => {
    console.log('[Kafka] ✅ Producer connected');
  }).catch((err) => {
    console.error('[Kafka] ❌ Producer connection failed:', err);
  });

  await kafkaConsumer.connect().then(() => {
    console.log('[Kafka] ✅ Consumer connected');
  }).catch((err) => {
    console.error('[Kafka] ❌ Consumer connection failed:', err);
  });

  isConnected = true;
};
