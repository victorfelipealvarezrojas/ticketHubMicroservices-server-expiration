import Queue from 'bull';
import { ExpirationCompletePublisher } from '../src/events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../src/nats-wrapper';

interface payload {
    orderId: string;
}



const expirationQueue = new Queue<payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST //servidor redis, aqui contiene el valor del servicio que comunica con el pod de redis
    }
});

expirationQueue.process(async (job) => {
    new ExpirationCompletePublisher(natsWrapper.getClient).publish({
        orderId: job.data.orderId
    });

    console.log('Completar el identificador de evento u orden', job.data.orderId);
});

export { expirationQueue };