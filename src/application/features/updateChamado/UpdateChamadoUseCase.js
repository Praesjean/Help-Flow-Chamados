const Chamado = require('../../../domain/entities/Chamado');

class UpdateChamadoUseCase {
    constructor(chamadoRepository) {
        this.chamadoRepository = chamadoRepository;
    }

    async execute(id, dados) {
        const atualizacao = Chamado.prepararAtualizacao(dados);

        return await this.chamadoRepository.atualizar(id, atualizacao);
    }
}

module.exports = UpdateChamadoUseCase;