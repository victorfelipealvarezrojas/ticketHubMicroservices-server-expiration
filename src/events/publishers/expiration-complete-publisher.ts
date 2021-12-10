import { Subjects,Publisher, ExpirationCompleteEvent } from '@ticketshub/commun';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

