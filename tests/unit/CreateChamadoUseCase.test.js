
const CreateChamadoUseCase = require('../../src/application/features/createChamado/CreateChamadoUseCase');

describe('CreateChamadoUseCase', () => {
    let chamadoRepository;
    let createChamadoUseCase;

    beforeEach(() => {
        chamadoRepository = {
            criar: jest.fn()
        };

        createChamadoUseCase = new CreateChamadoUseCase(
            chamadoRepository
        );
    });

    test('deve criar um chamado com dados válidos', async () => {
        const dados = {
            titulo: 'Erro no sistema',
            descricao: 'Não consigo realizar login.',
            prioridade: 'ALTA',
            usuarioId: 'usuario-001'
        };

        chamadoRepository.criar.mockResolvedValue({
            _id: 'chamado-001',
            ...dados,
            status: 'ABERTO'
        });

        const resultado = await createChamadoUseCase.execute(dados);

        expect(resultado._id).toBe('chamado-001');
        expect(resultado.status).toBe('ABERTO');
        expect(resultado.prioridade).toBe('ALTA');
        expect(chamadoRepository.criar).toHaveBeenCalledTimes(1);
    });

    test('deve rejeitar título vazio', async () => {
        const dados = {
            titulo: '',
            descricao: 'Problema no sistema',
            usuarioId: 'usuario-001'
        };

        await expect(
            createChamadoUseCase.execute(dados)
        ).rejects.toThrow(
            'Título, descrição e usuário são obrigatórios.'
        );

        expect(chamadoRepository.criar).not.toHaveBeenCalled();
    });

    test('deve rejeitar descrição vazia', async () => {
        const dados = {
            titulo: 'Erro',
            descricao: '',
            usuarioId: 'usuario-001'
        };

        await expect(
            createChamadoUseCase.execute(dados)
        ).rejects.toThrow(
            'Título, descrição e usuário são obrigatórios.'
        );

        expect(chamadoRepository.criar).not.toHaveBeenCalled();
    });

    test('deve rejeitar usuário vazio', async () => {
        const dados = {
            titulo: 'Erro',
            descricao: 'Problema no sistema',
            usuarioId: ''
        };

        await expect(
            createChamadoUseCase.execute(dados)
        ).rejects.toThrow(
            'Título, descrição e usuário são obrigatórios.'
        );

        expect(chamadoRepository.criar).not.toHaveBeenCalled();
    });

    test('deve rejeitar prioridade inválida', async () => {
        const dados = {
            titulo: 'Erro',
            descricao: 'Problema no sistema',
            prioridade: 'URGENTE',
            usuarioId: 'usuario-001'
        };

        await expect(
            createChamadoUseCase.execute(dados)
        ).rejects.toThrow('Prioridade inválida.');

        expect(chamadoRepository.criar).not.toHaveBeenCalled();
    });

    test('deve definir prioridade MEDIA por padrão', async () => {
        const dados = {
            titulo: 'Erro',
            descricao: 'Problema no sistema',
            usuarioId: 'usuario-001'
        };

        chamadoRepository.criar.mockImplementation(
            async (chamado) => ({
                _id: 'chamado-002',
                ...chamado
            })
        );

        const resultado = await createChamadoUseCase.execute(dados);

        expect(resultado.prioridade).toBe('MEDIA');
        expect(resultado.status).toBe('ABERTO');
    });
});