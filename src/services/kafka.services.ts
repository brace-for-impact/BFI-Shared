import { Kafka, Message, Producer, Consumer, EachMessagePayload, KafkaJSConnectionError, KafkaJSProtocolError } from 'kafkajs';

const RETRY_DELAY_MS = 3000;
const MAX_RETRIES = 5;

const send = (closureArgs: { kafkaProducer: Producer }) => async (
  args: { topic: string; messages: Message[] }
) => {
  const { kafkaProducer } = closureArgs;
  const { messages, topic } = args;

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      await kafkaProducer.send({ topic, messages });
      return; 
    } catch (error) {
      attempt++;
      console.error(`[Kafka Producer] Error sending messages (attempt ${attempt}):`, error);
      if (attempt >= MAX_RETRIES) {
        throw error; 
      }
      await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
    }
  }
};

const consume = (closureArgs: { kafkaConsumer: Consumer }) => async (
  args: {
    topics: string[];
    onMessage: (payload: EachMessagePayload) => Promise<void>;
  }
) => {
  const { kafkaConsumer } = closureArgs;
  const { topics, onMessage } = args;

  for (const topic of topics) {
    await kafkaConsumer.subscribe({ topic, fromBeginning: false });
  }

  const runConsumer = async () => {
    try {
      await kafkaConsumer.run({
        eachMessage: async (payload) => {
          try {
            await onMessage(payload);
          } catch (err) {
            console.error('[Kafka Consumer] Error processing message:', err);
            
          }
        },
      });
    } catch (err) {
      console.error('[Kafka Consumer] Consumer run error:', err);
      
      await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
      await runConsumer();
    }
  };

  await runConsumer();
};

export const getKafkaServices = async (args: {
  clientId: string;
  brokers: string[];
  groupId: string;
}) => {
  const { clientId, brokers, groupId } = args;

  const kafka = new Kafka({ clientId, brokers });

  const kafkaProducer = kafka.producer();
  const kafkaConsumer = kafka.consumer({ groupId });

  try {
    await kafkaProducer.connect();
    console.log('[Kafka] ✅ Producer connected');
  } catch (err) {
    console.error('[Kafka] ❌ Producer connection failed:', err);
  }

  try {
    await kafkaConsumer.connect();
    console.log('[Kafka] ✅ Consumer connected');
  } catch (err) {
    console.error('[Kafka] ❌ Consumer connection failed:', err);
  }

  return {
    send: send({ kafkaProducer }),
    consume: consume({ kafkaConsumer }),
  };
};
