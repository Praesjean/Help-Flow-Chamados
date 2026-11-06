class Chamado {
    static STATUS_VALIDOS = Object.freeze([
        'ABERTO',
        'EM_ANDAMENTO',
        'RESOLVIDO',
        'FECHADO'
    ]);

    static PRIORIDADES_VALIDAS = Object.freeze([
        'BAIXA',
        'MEDIA',
        'ALTA',
        'CRITICA'
    ]);

    static CAMPOS_ATUALIZAVEIS = Object.freeze([
        'titulo',
        'descricao',
        'status',
        'prioridade'
    ]);

    static validarTexto(valor, campo) {
        if (typeof valor !== 'string' || !valor.trim()) {
            throw new Error(`${campo} não pode estar vazio.`);
        }

        return valor.trim();
    }

    static validarPrioridade(prioridade) {
        if (!this.PRIORIDADES_VALIDAS.includes(prioridade)) {
            throw new Error('Prioridade inválida.');
        }

        return prioridade;
    }

    static validarStatus(status) {
        if (!this.STATUS_VALIDOS.includes(status)) {
            throw new Error('Status inválido.');
        }

        return status;
    }

    static criar(dados) {
        if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
            throw new Error(
                'Título, descrição e usuário são obrigatórios.'
            );
        }

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

        return {
            titulo: this.validarTexto(titulo, 'titulo'),
            descricao: this.validarTexto(descricao, 'descricao'),
            usuarioId: usuarioId.trim(),
            prioridade: this.validarPrioridade(prioridade ?? 'MEDIA'),
            status: 'ABERTO'
        };
    }

    static prepararAtualizacao(dados) {
        if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
            throw new Error('Dados de atualização inválidos.');
        }

        const campos = Object.keys(dados);

        if (
            campos.length === 0 ||
            campos.some(campo => !this.CAMPOS_ATUALIZAVEIS.includes(campo))
        ) {
            throw new Error('Campos de atualização inválidos.');
        }

        const atualizacao = {};

        for (const campo of campos) {
            const valor = dados[campo];

            if (campo === 'titulo' || campo === 'descricao') {
                atualizacao[campo] = this.validarTexto(valor, campo);
            }

            if (campo === 'status') {
                atualizacao.status = this.validarStatus(valor);
            }

            if (campo === 'prioridade') {
                atualizacao.prioridade = this.validarPrioridade(valor);
            }
        }

        return atualizacao;
    }
}

module.exports = Chamado;