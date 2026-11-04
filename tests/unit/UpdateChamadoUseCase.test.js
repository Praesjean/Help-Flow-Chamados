const UpdateChamadoUseCase = require(
    '../../src/application/features/updateChamado/UpdateChamadoUseCase'
);

describe('UpdateChamadoUseCase', () => {
    let repository;
    let useCase;

    beforeEach(() => {
        repository = {
            atualizar: jest.fn()
        };

        useCase = new UpdateChamadoUseCase(repository);
    });

    test('deve atualizar um chamado com dados válidos', async () => {
        const dados = {
            titulo: 'Erro corrigido',
            descricao: 'Problema resolvido',
            status: 'RESOLVIDO',
            prioridade: 'ALTA'
        };

        repository.atualizar.mockResolvedValue({
            _id: '123',
            ...dados
        });

        const resultado = await useCase.execute('123', dados);

        expect(resultado.status).toBe('RESOLVIDO');
        expect(resultado.prioridade).toBe('ALTA');

        expect(repository.atualizar).toHaveBeenCalledWith(
            '123',
            dados
        );
    });

    test('deve permitir atualização parcial', async () => {
        repository.atualizar.mockResolvedValue({
            _id: '123',
            status: 'EM_ANDAMENTO'
        });

        const resultado = await useCase.execute('123', {
            status: 'EM_ANDAMENTO'
        });

        expect(resultado.status).toBe('EM_ANDAMENTO');

        expect(repository.atualizar).toHaveBeenCalledWith(
            '123',
            { status: 'EM_ANDAMENTO' }
        );
    });

    test('deve remover espaços do título e descrição', async () => {
        repository.atualizar.mockResolvedValue({
            _id: '123',
            titulo: 'Novo título',
            descricao: 'Nova descrição'
        });

        await useCase.execute('123', {
            titulo: '  Novo título  ',
            descricao: '  Nova descrição  '
        });

        expect(repository.atualizar).toHaveBeenCalledWith(
        '123',
        {
            titulo: 'Novo título',
            descricao: 'Nova descrição'
        }
        );
    });

    test.each([
        null,
        undefined,
        'texto',
        [],
        123
    ])('deve rejeitar dados inválidos: %p', async (dados) => {
        await expect(
            useCase.execute('123', dados)
        ).rejects.toThrow('Dados de atualização inválidos.');

        expect(repository.atualizar).not.toHaveBeenCalled();
    });

    test('deve rejeitar objeto vazio', async () => {
        await expect(
            useCase.execute('123', {})
        ).rejects.toThrow('Campos de atualização inválidos.');

        expect(repository.atualizar).not.toHaveBeenCalled();
    });

    test('deve rejeitar campos não permitidos', async () => {
        await expect(
            useCase.execute('123', {
                usuarioId: 'usuario-002'
            })
        ).rejects.toThrow('Campos de atualização inválidos.');

        expect(repository.atualizar).not.toHaveBeenCalled();
    });

    test.each([
        { titulo: '' },
        { titulo: '   ' },
        { titulo: 123 },
        { descricao: '' },
        { descricao: '   ' },
        { descricao: null }
    ])('deve rejeitar texto inválido: %p', async (dados) => {
        await expect(
            useCase.execute('123', dados)
        ).rejects.toThrow(/não pode estar vazio/);

        expect(repository.atualizar).not.toHaveBeenCalled();
    });

    test('deve rejeitar status inválido', async () => {
        await expect(
            useCase.execute('123', {
                status: 'CANCELADO'
            })
        ).rejects.toThrow('Status inválido.');

        expect(repository.atualizar).not.toHaveBeenCalled();
    });

    test('deve rejeitar prioridade inválida', async () => {
        await expect(
            useCase.execute('123', {
                prioridade: 'URGENTE'
            })
        ).rejects.toThrow('Prioridade inválida.');

        expect(repository.atualizar).not.toHaveBeenCalled();
    });

    test.each([
        'ABERTO',
        'EM_ANDAMENTO',
        'RESOLVIDO',
        'FECHADO'
    ])('deve aceitar o status %s', async (status) => {
        repository.atualizar.mockResolvedValue({
            _id: '123',
            status
        });

        await useCase.execute('123', { status });

        expect(repository.atualizar).toHaveBeenCalledWith(
            '123',
            { status }
        );
    });

    test.each([
        'BAIXA',
        'MEDIA',
        'ALTA',
        'CRITICA'
    ])('deve aceitar a prioridade %s', async (prioridade) => {
        repository.atualizar.mockResolvedValue({
            _id: '123',
            prioridade
        });

        await useCase.execute('123', { prioridade });

        expect(repository.atualizar).toHaveBeenCalledWith(
            '123',
            { prioridade }
        );
    });

    test('deve retornar null quando o chamado não existir', async () => {
        repository.atualizar.mockResolvedValue(null);

        const resultado = await useCase.execute('999', {
            status: 'FECHADO'
        });

        expect(resultado).toBeNull();
    });
});