const ListChamadosUseCase = require(
    '../../src/application/features/listChamados/ListChamadosUseCase'
);

const GetChamadoUseCase = require(
    '../../src/application/features/getChamado/GetChamadoUseCase'
);

const DeleteChamadoUseCase = require(
    '../../src/application/features/deleteChamado/DeleteChamadoUseCase'
);

describe('ListChamadosUseCase', () => {
    const admin = { id: '2', perfil: 'ADMIN' };
    const atendente = { id: '3', perfil: 'ATENDENTE' };
    const cliente = { id: '4', perfil: 'CLIENTE' };

    test('ADMIN deve listar todos os chamados', async () => {
        const chamados = [
            { _id: '1', titulo: 'Erro no login' },
            { _id: '2', titulo: 'Sistema lento' }
        ];

        const repository = {
            listar: jest.fn().mockResolvedValue(chamados)
        };

        const useCase = new ListChamadosUseCase(repository);
        const resultado = await useCase.execute(admin);

        expect(resultado).toEqual(chamados);
        expect(repository.listar).toHaveBeenCalledTimes(1);
        expect(repository.listar).toHaveBeenCalledWith();
    });

    test('deve retornar lista vazia', async () => {
        const repository = {
            listar: jest.fn().mockResolvedValue([])
        };

        const useCase = new ListChamadosUseCase(repository);
        const resultado = await useCase.execute(admin);

        expect(resultado).toEqual([]);
    });

    test('ATENDENTE deve listar todos os chamados', async () => {
        const repository = {
            listar: jest.fn().mockResolvedValue([])
        };

        const useCase = new ListChamadosUseCase(repository);
        await useCase.execute(atendente);

        expect(repository.listar).toHaveBeenCalledWith();
    });

    test('CLIENTE deve listar apenas seus chamados', async () => {
        const chamados = [
            { _id: '1', usuarioId: '4' }
        ];

        const repository = {
            listar: jest.fn().mockResolvedValue(chamados)
        };

        const useCase = new ListChamadosUseCase(repository);
        const resultado = await useCase.execute(cliente);

        expect(resultado).toEqual(chamados);
        expect(repository.listar).toHaveBeenCalledWith('4');
    });

    test('deve rejeitar usuario nao autenticado', async () => {
        const repository = {
            listar: jest.fn()
        };

        const useCase = new ListChamadosUseCase(repository);

        await expect(
            useCase.execute()
        ).rejects.toMatchObject({
            status: 401
        });

        expect(repository.listar).not.toHaveBeenCalled();
    });

    test('deve rejeitar perfil sem permissao', async () => {
        const repository = {
            listar: jest.fn()
        };

        const useCase = new ListChamadosUseCase(repository);

        await expect(
            useCase.execute({
                id: '5',
                perfil: 'VISITANTE'
            })
        ).rejects.toMatchObject({
            status: 403
        });

        expect(repository.listar).not.toHaveBeenCalled();
    });
});

describe('GetChamadoUseCase', () => {
    test('deve buscar um chamado pelo ID', async () => {
        const chamado = {
            _id: '123',
            titulo: 'Erro no sistema'
        };

        const repository = {
            buscarPorId: jest.fn().mockResolvedValue(chamado)
        };

        const useCase = new GetChamadoUseCase(repository);
        const resultado = await useCase.execute('123');

        expect(resultado).toEqual(chamado);
        expect(repository.buscarPorId).toHaveBeenCalledWith('123');
    });

    test('deve retornar null quando nao existir', async () => {
        const repository = {
            buscarPorId: jest.fn().mockResolvedValue(null)
        };

        const useCase = new GetChamadoUseCase(repository);
        const resultado = await useCase.execute('999');

        expect(resultado).toBeNull();
    });
});

describe('DeleteChamadoUseCase', () => {
    test('deve excluir um chamado existente', async () => {
        const chamado = {
            _id: '123',
            titulo: 'Chamado excluido'
        };

        const repository = {
            excluir: jest.fn().mockResolvedValue(chamado)
        };

        const useCase = new DeleteChamadoUseCase(repository);
        const resultado = await useCase.execute('123');

        expect(resultado).toEqual(chamado);
        expect(repository.excluir).toHaveBeenCalledWith('123');
    });

    test('deve retornar null quando nao existir', async () => {
        const repository = {
            excluir: jest.fn().mockResolvedValue(null)
        };

        const useCase = new DeleteChamadoUseCase(repository);
        const resultado = await useCase.execute('999');

        expect(resultado).toBeNull();
    });
});