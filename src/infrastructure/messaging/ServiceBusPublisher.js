const { randomUUID } = require('node:crypto');

const QUEUE_NAME = 'chamados-eventos';

let client = null;
let sender = null;

function obterSender() {
    if (sender) {
        return sender;
    }

    const connectionString = process.env.SERVICEBUS_CONNECTION_STRING;

    if (!connectionString) {
        throw new Error(
            'SERVICEBUS_CONNECTION_STRING não configurada.'
        );
    }

    const { ServiceBusClient } = require('@azure/service-bus');

    client = new ServiceBusClient(connectionString);
    sender = client.createSender(QUEUE_NAME);

    return sender;
}

async function publicarEvento(tipo, chamado) {
    const evento = {
        eventoId: randomUUID(),
        tipo,
        ocorridoEm: new Date().toISOString(),
        origem: 'microservice-chamados',
        dados: chamado
    };

    const mensagem = {
        messageId: evento.eventoId,
        subject: tipo,
        contentType: 'application/json',
        body: evento
    };

    await obterSender().sendMessages(mensagem);

    console.log(
        `[Service Bus] Evento ${tipo} publicado com sucesso.`
    );

    return evento;
}

module.exports = {
    publicarEvento
};