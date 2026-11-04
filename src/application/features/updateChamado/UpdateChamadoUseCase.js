class UpdateChamadoUseCase {
    constructor(chamadoRepository) {
        this.chamadoRepository = chamadoRepository;
    }

    async execute(id, dados) {
        if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
            throw new Error('Dados de atualização inválidos.');
        }

        const camposPermitidos = [
            'titulo',
            'descricao',
            'status',
            'prioridade'
        ];

        const camposRecebidos = Object.keys(dados);

        if (
            camposRecebidos.length === 0 ||
            camposRecebidos.some(campo => !camposPermitidos.includes(campo))
        ) {
            throw new Error('Campos de atualização inválidos.');
        }

        const atualizacao = {};

        for (const campo of camposRecebidos) {
            const valor = dados[campo];

            if (campo === 'titulo' || campo === 'descricao') {
                if (typeof valor !== 'string' || !valor.trim()) {
                    throw new Error(`${campo} não pode estar vazio.`);
                }

                atualizacao[campo] = valor.trim();
            }

            if (campo === 'status') {
                const statusValidos = [
                    'ABERTO',
                    'EM_ANDAMENTO',
                    'RESOLVIDO',
                    'FECHADO'
                ];

                if (!statusValidos.includes(valor)) {
                    throw new Error('Status inválido.');
                }

                atualizacao.status = valor;
            }

            if (campo === 'prioridade') {
                const prioridadesValidas = [
                    'BAIXA',
                    'MEDIA',
                    'ALTA',
                    'CRITICA'
                ];

                if (!prioridadesValidas.includes(valor)) {
                    throw new Error('Prioridade inválida.');
                }

                atualizacao.prioridade = valor;
            }
        }

        return await this.chamadoRepository.atualizar(id, atualizacao);
    }
}

module.exports = UpdateChamadoUseCase;