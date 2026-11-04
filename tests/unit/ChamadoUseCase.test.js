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
    test('deve listar os chamados existentes', async () => {
        const chamados = [
            { _id: '1', titulo: 'Erro no login' },
            { _id: '2', titulo: 'Sistema lento' }
        ];

        const repository = {
            listar: jest.fn().mockResolvedValue(chamados)
        };

        const useCase = new ListChamadosUseCase(repository);
        const resultado = await useCase.execute();

        expect(resultado).toEqual(chamados);
        expect(repository.listar).toHaveBeenCalledTimes(1);
    });

    test('deve retornar lista vazia quando não houver chamados', async () => {
        const repository = {
            listar: jest.fn().mockResolvedValue([])
        };

        const useCase = new ListChamadosUseCase(repository);
        const resultado = await useCase.execute();

        expect(resultado).toEqual([]);
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

    test('deve retornar null quando o chamado não existir', async () => {
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
            titulo: 'Chamado excluído'
        };

        const repository = {
            excluir: jest.fn().mockResolvedValue(chamado)
        };

        const useCase = new DeleteChamadoUseCase(repository);
        const resultado = await useCase.execute('123');

        expect(resultado).toEqual(chamado);
        expect(repository.excluir).toHaveBeenCalledWith('123');
    });

    test('deve retornar null quando o chamado não existir', async () => {
        const repository = {
            excluir: jest.fn().mockResolvedValue(null)
        };

        const useCase = new DeleteChamadoUseCase(repository);
        const resultado = await useCase.execute('999');

        expect(resultado).toBeNull();
    });
});