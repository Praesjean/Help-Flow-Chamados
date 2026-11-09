const { ServiceBusClient } = require('@azure/service-bus');

const QUEUE_NAME = 'chamados-eventos';

async function iniciarConsumidor() {
    const connectionString = process.env.SERVICEBUS_CONNECTION_STRING;

    if (!connectionString) {
        throw new Error(
            'SERVICEBUS_CONNECTION_STRING não configurada.'
        );
    }

    const client = new ServiceBusClient(connectionString);
    const receiver = client.createReceiver(QUEUE_NAME);

    console.log('[Consumer] Aguardando eventos do Azure Service Bus...');

    receiver.subscribe({
        processMessage: async (message) => {
            const evento = message.body;

            console.log('[Consumer] Evento recebido:', evento.tipo);
            console.log('[Consumer] Dados:', JSON.stringify(evento.dados));

            switch (evento.tipo) {
                case 'ChamadoCriado':
                    console.log('[Consumer] Novo chamado registrado.');
                    break;

                case 'ChamadoAtualizado':
                    console.log('[Consumer] Chamado atualizado.');
                    break;

                case 'ChamadoExcluido':
                    console.log('[Consumer] Chamado excluído.');
                    break;

                default:
                    console.log('[Consumer] Tipo de evento desconhecido.');
            }
        },

        processError: async (args) => {
            console.error(
                '[Consumer] Erro ao processar mensagem:',
                args.error.message
            );
        }
    });
}

iniciarConsumidor().catch((error) => {
    console.error('[Consumer] Falha ao iniciar:', error.message);
    process.exit(1);
});