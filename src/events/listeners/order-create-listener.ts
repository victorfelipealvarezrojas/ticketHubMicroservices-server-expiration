import { Listener, OrderCreatedEvent, Subjects } from "@ticketshub/commun";
import { Message } from "node-nats-streaming";
import { queueGropuName } from "./queue-group-name";
import { expirationQueue } from "../../../queues/expiration-queue";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGropuName = queueGropuName;

    //onMensaje es algo que nos habla de los datos subyacentes procedentes del servidor de nats y es aqui donde se procesa 
    //o se gatilla una accion copmo respuesta del evento emitido por orderpyt al bus de la nats, en pocas palabras orderpyt emite un evento a la nats
    //y este lsitener de expiration lo estara escuchando para procesarlo
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expirateAt).getTime() - new Date().getTime();//me devuleve el tiempo en milisegundos
        console.log('stos son muchos milisegundos para procesar el trabajo.', delay);
        //aqui se comunicara con redis y emitira los datos de la orden recepcionada por medio del evento de nueva orden
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay //tiempo de retraso en la emision
        });
        msg.ack();
    }

}