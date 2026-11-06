const Chamado = require('../../../domain/entities/Chamado');

class CreateChamadoUseCase {
    constructor(chamadoRepository) {
        this.chamadoRepository = chamadoRepository;
    }

    async execute(dados) {
        const novoChamado = Chamado.criar(dados);

        return await this.chamadoRepository.criar(novoChamado);
    }
}

module.exports = CreateChamadoUseCase;