class ListChamadosUseCase {
    constructor(chamadoRepository) {
        this.chamadoRepository = chamadoRepository;
    }

    async execute() {
        return await this.chamadoRepository.listar();
    }
}

module.exports = ListChamadosUseCase;