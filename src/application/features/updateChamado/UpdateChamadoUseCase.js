const Chamado = require('../../../domain/entities/Chamado');

class UpdateChamadoUseCase {
    constructor(chamadoRepository, eventPublisher = null) {
        this.chamadoRepository = chamadoRepository;
        this.eventPublisher = eventPublisher;
    }

    async execute(id, dados) {
        const atualizacao = Chamado.prepararAtualizacao(dados);

        const chamadoAtualizado = await this.chamadoRepository.atualizar(
            id,
            atualizacao
        );

        if (!chamadoAtualizado) {
            return null;
        }

        if (this.eventPublisher) {
            try {
                await this.eventPublisher.publicarEvento(
                    'ChamadoAtualizado',
                    chamadoAtualizado
                );
            } catch (error) {
                console.error(
                    '[Service Bus] Falha ao publicar ChamadoAtualizado:',
                    error.message
                );
            }
        }

        return chamadoAtualizado;
    }
}

module.exports = UpdateChamadoUseCase;