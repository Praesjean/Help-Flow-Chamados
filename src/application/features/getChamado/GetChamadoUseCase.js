class GetChamadoUseCase {
    constructor(chamadoRepository) {
        this.chamadoRepository = chamadoRepository;
    }

    async execute(id) {
        return await this.chamadoRepository.buscarPorId(id);
    }
}

module.exports = GetChamadoUseCase;