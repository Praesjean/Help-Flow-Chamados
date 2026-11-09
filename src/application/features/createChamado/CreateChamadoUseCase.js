const Chamado = require('../../../domain/entities/Chamado');

class CreateChamadoUseCase {
    constructor(chamadoRepository, eventPublisher = null) {
        this.chamadoRepository = chamadoRepository;
        this.eventPublisher = eventPublisher;
    }

    async execute(dados) {
        const novoChamado = Chamado.criar(dados);

        const chamadoCriado = await this.chamadoRepository.criar(novoChamado);

        if (this.eventPublisher) {
            try {
                await this.eventPublisher.publicarEvento(
                    'ChamadoCriado',
                    chamadoCriado
                );
            } catch (error) {
                console.error(
                    '[Service Bus] Falha ao publicar ChamadoCriado:',
                    error.message
                );
            }
        }

        return chamadoCriado;
    }
}

module.exports = CreateChamadoUseCase;