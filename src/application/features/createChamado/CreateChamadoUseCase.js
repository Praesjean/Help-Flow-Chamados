class CreateChamadoUseCase {
    constructor(chamadoRepository) {
        this.chamadoRepository = chamadoRepository;
    }

    async execute(dados) {
        const { titulo, descricao, prioridade, usuarioId } = dados;

        if (
            typeof titulo !== 'string' ||
            !titulo.trim() ||
            typeof descricao !== 'string' ||
            !descricao.trim() ||
            typeof usuarioId !== 'string' ||
            !usuarioId.trim()
        ) {
            throw new Error(
                'Título, descrição e usuário são obrigatórios.'
            );
        }

        const prioridadesValidas = [
            'BAIXA',
            'MEDIA',
            'ALTA',
            'CRITICA'
        ];

        if (
            prioridade !== undefined &&
            !prioridadesValidas.includes(prioridade)
        ) {
            throw new Error('Prioridade inválida.');
        }

        const novoChamado = {
            titulo: titulo.trim(),
            descricao: descricao.trim(),
            usuarioId: usuarioId.trim(),
            prioridade: prioridade || 'MEDIA',
            status: 'ABERTO'
        };

        return await this.chamadoRepository.criar(novoChamado);
    }
}

module.exports = CreateChamadoUseCase;