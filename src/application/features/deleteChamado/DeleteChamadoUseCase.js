class DeleteChamadoUseCase {
    constructor(chamadoRepository, eventPublisher = null) {
        this.chamadoRepository = chamadoRepository;
        this.eventPublisher = eventPublisher;
    }

    async execute(id) {
        const chamadoExcluido = await this.chamadoRepository.excluir(id);

        if (!chamadoExcluido) {
            return null;
        }

        if (this.eventPublisher) {
            try {
                await this.eventPublisher.publicarEvento(
                    'ChamadoExcluido',
                    chamadoExcluido
                );
            } catch (error) {
                console.error(
                    '[Service Bus] Falha ao publicar ChamadoExcluido:',
                    error.message
                );
            }
        }

        return chamadoExcluido;
    }
}

module.exports = DeleteChamadoUseCase;