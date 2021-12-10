import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-create-listener';


natsWrapper
const start = async () => {
  if (!process.env.NATS_CLIENT_ID) throw new Error("NATS_CLIENT_ID must be defined");
  if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");
  if (!process.env.NATS_CLUSTER_ID) throw new Error("NATS_CLUSTER_ID must be defined");

  try {
    //coneccion a nats, que es el bus de eventos, ticketing es el id del cluster que tengo definido e n lsoa rchivos de implementacion
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

    //escucha el cierre del client para matar la comunmicacion con el bus de eventos, incluso si elimino el pod de la nats se ejecutara este cierre
    natsWrapper.getClient.on('close', () => {
      console.log('NATS connection closed!!!!');
      process.exit();//reacciona a la accion de cerrar el cliente inculso desde la consola
    });

    process.on('SIGINT', () => natsWrapper.getClient.close());
    process.on('SIGTERM', () => natsWrapper.getClient.close());

    //listener que esta esperando recibir un evento de orderpyt(al crear una orden)
    new OrderCreatedListener(natsWrapper.getClient).listen();

  } catch (err) {
    console.error(err);
  }

}

start();
