class DeleteChamadoUseCase {
    constructor(chamadoRepository) {
        this.chamadoRepository = chamadoRepository;
    }

    async execute(id) {
        return await this.chamadoRepository.excluir(id);
    }
}

module.exports = DeleteChamadoUseCase;