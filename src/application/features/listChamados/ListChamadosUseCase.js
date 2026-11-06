class ListChamadosUseCase {
    constructor(chamadoRepository) {
        this.chamadoRepository = chamadoRepository;
    }

    async execute(usuario) {
        if (!usuario || !usuario.id || !usuario.perfil) {
            const erro = new Error('Usuário não autenticado.');
            erro.status = 401;
            throw erro;
        }

        const perfisPermitidos = ['ADMIN', 'ATENDENTE', 'CLIENTE'];

        if (!perfisPermitidos.includes(usuario.perfil)) {
            const erro = new Error('Perfil sem permissão para consultar chamados.');
            erro.status = 403;
            throw erro;
        }

        if (usuario.perfil === 'CLIENTE') {
            return await this.chamadoRepository.listar(usuario.id);
        }

        return await this.chamadoRepository.listar();
    }
}

module.exports = ListChamadosUseCase;