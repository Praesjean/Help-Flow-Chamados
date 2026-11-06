const request = require('supertest');
const jwt = require('jsonwebtoken');

const mockRepository = {
    criar: jest.fn(),
    listar: jest.fn(),
    buscarPorId: jest.fn(),
    atualizar: jest.fn(),
    excluir: jest.fn()
};

jest.mock(
    '../../src/infrastructure/repositories/ChamadoRepository',
    () => jest.fn().mockImplementation(() => mockRepository)
);

process.env.JWT_SECRET = 'segredo-exclusivo-para-testes-jest';

const app = require('../../src/app');

const ID_VALIDO = '507f1f77bcf86cd799439011';
const ID_INEXISTENTE = '507f1f77bcf86cd799439012';

const chamadoExemplo = {
    _id: ID_VALIDO,
    titulo: 'Erro no login',
    descricao: 'Nao consigo acessar o sistema.',
    status: 'ABERTO',
    prioridade: 'ALTA',
    usuarioId: '4'
};

function gerarToken(perfil = 'ADMIN', id = '2') {
    return jwt.sign(
        { perfil },
        process.env.JWT_SECRET,
        {
            algorithm: 'HS256',
            subject: String(id),
            expiresIn: '1h'
        }
    );
}

function autenticar(requisicao, perfil = 'ADMIN', id = '2') {
    return requisicao.set(
        'Authorization',
        `Bearer ${gerarToken(perfil, id)}`
    );
}

describe('API de Chamados', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Autenticacao JWT', () => {
        test('deve retornar 401 sem token', async () => {
            const resposta = await request(app)
                .get('/api/chamados');

            expect(resposta.status).toBe(401);
            expect(mockRepository.listar).not.toHaveBeenCalled();
        });

        test('deve retornar 401 com token invalido', async () => {
            const resposta = await request(app)
                .get('/api/chamados')
                .set('Authorization', 'Bearer token-invalido');

            expect(resposta.status).toBe(401);
        });
    });

    describe('POST /api/chamados', () => {
        test('deve criar um chamado e retornar 201', async () => {
            mockRepository.criar.mockResolvedValue(chamadoExemplo);

            const resposta = await autenticar(
                request(app).post('/api/chamados')
            ).send({
                titulo: chamadoExemplo.titulo,
                descricao: chamadoExemplo.descricao,
                prioridade: chamadoExemplo.prioridade,
                usuarioId: chamadoExemplo.usuarioId
            });

            expect(resposta.status).toBe(201);
            expect(resposta.body.mensagem).toBe(
                'Chamado criado com sucesso.'
            );
            expect(resposta.body.chamado._id).toBe(ID_VALIDO);
        });

        test('deve retornar 400 quando faltar titulo', async () => {
            const resposta = await autenticar(
                request(app).post('/api/chamados')
            ).send({
                descricao: 'Problema no sistema',
                usuarioId: '4'
            });

            expect(resposta.status).toBe(400);
            expect(mockRepository.criar).not.toHaveBeenCalled();
        });

        test('deve retornar 400 para prioridade invalida', async () => {
            const resposta = await autenticar(
                request(app).post('/api/chamados')
            ).send({
                titulo: 'Erro',
                descricao: 'Problema',
                prioridade: 'URGENTE',
                usuarioId: '4'
            });

            expect(resposta.status).toBe(400);
            expect(mockRepository.criar).not.toHaveBeenCalled();
        });

        test('CLIENTE deve criar chamado com seu proprio ID', async () => {
            mockRepository.criar.mockImplementation(
                async (dados) => ({
                    ...dados,
                    _id: ID_VALIDO
                })
            );

            const resposta = await autenticar(
                request(app).post('/api/chamados'),
                'CLIENTE',
                '4'
            ).send({
                titulo: 'Problema de acesso',
                descricao: 'Nao consigo acessar',
                prioridade: 'MEDIA',
                usuarioId: '999'
            });

            expect(resposta.status).toBe(201);
            expect(mockRepository.criar).toHaveBeenCalledWith(
                expect.objectContaining({
                    usuarioId: '4'
                })
            );
        });
    });

    describe('GET /api/chamados', () => {
        test('ADMIN deve listar todos os chamados', async () => {
            mockRepository.listar.mockResolvedValue([chamadoExemplo]);

            const resposta = await autenticar(
                request(app).get('/api/chamados')
            );

            expect(resposta.status).toBe(200);
            expect(resposta.body).toHaveLength(1);
            expect(resposta.body[0].titulo).toBe('Erro no login');
            expect(mockRepository.listar).toHaveBeenCalledWith();
        });

        test('deve retornar lista vazia', async () => {
            mockRepository.listar.mockResolvedValue([]);

            const resposta = await autenticar(
                request(app).get('/api/chamados')
            );

            expect(resposta.status).toBe(200);
            expect(resposta.body).toEqual([]);
        });

        test('CLIENTE deve listar somente seus chamados', async () => {
            mockRepository.listar.mockResolvedValue([chamadoExemplo]);

            const resposta = await autenticar(
                request(app).get('/api/chamados'),
                'CLIENTE',
                '4'
            );

            expect(resposta.status).toBe(200);
            expect(mockRepository.listar).toHaveBeenCalledWith('4');
            expect(resposta.body).toHaveLength(1);
        });

        test('ATENDENTE deve listar todos os chamados', async () => {
            mockRepository.listar.mockResolvedValue([chamadoExemplo]);

            const resposta = await autenticar(
                request(app).get('/api/chamados'),
                'ATENDENTE',
                '3'
            );

            expect(resposta.status).toBe(200);
            expect(mockRepository.listar).toHaveBeenCalledWith();
        });
    });

    describe('GET /api/chamados/:id', () => {
        test('deve buscar um chamado existente', async () => {
            mockRepository.buscarPorId.mockResolvedValue(chamadoExemplo);

            const resposta = await autenticar(
                request(app).get(`/api/chamados/${ID_VALIDO}`)
            );

            expect(resposta.status).toBe(200);
            expect(resposta.body._id).toBe(ID_VALIDO);
        });

        test('deve retornar 400 para ID invalido', async () => {
            const resposta = await autenticar(
                request(app).get('/api/chamados/id-invalido')
            );

            expect(resposta.status).toBe(400);
            expect(mockRepository.buscarPorId).not.toHaveBeenCalled();
        });

        test('deve retornar 404 quando nao existir', async () => {
			mockRepository.buscarPorId.mockResolvedValue(null);

			const resposta = await autenticar(
				request(app).put(`/api/chamados/${ID_INEXISTENTE}`)
			).send({ status: 'FECHADO' });

			expect(resposta.status).toBe(404);
			expect(mockRepository.atualizar).not.toHaveBeenCalled();
		});

        test('CLIENTE deve consultar seu proprio chamado', async () => {
            mockRepository.buscarPorId.mockResolvedValue(chamadoExemplo);

            const resposta = await autenticar(
                request(app).get(`/api/chamados/${ID_VALIDO}`),
                'CLIENTE',
                '4'
            );

            expect(resposta.status).toBe(200);
        });

        test('CLIENTE nao deve consultar chamado de outro usuario', async () => {
            mockRepository.buscarPorId.mockResolvedValue(chamadoExemplo);

            const resposta = await autenticar(
                request(app).get(`/api/chamados/${ID_VALIDO}`),
                'CLIENTE',
                '99'
            );

            expect(resposta.status).toBe(403);
        });
    });

    describe('PUT /api/chamados/:id', () => {
        test('ADMIN deve atualizar um chamado', async () => {
            mockRepository.atualizar.mockResolvedValue({
                ...chamadoExemplo,
                status: 'RESOLVIDO'
            });

            const resposta = await autenticar(
                request(app).put(`/api/chamados/${ID_VALIDO}`)
            ).send({ status: 'RESOLVIDO' });

            expect(resposta.status).toBe(200);
            expect(resposta.body.chamado.status).toBe('RESOLVIDO');
        });

        test('deve retornar 400 para status invalido', async () => {
            const resposta = await autenticar(
                request(app).put(`/api/chamados/${ID_VALIDO}`)
            ).send({ status: 'CANCELADO' });

            expect(resposta.status).toBe(400);
            expect(mockRepository.atualizar).not.toHaveBeenCalled();
        });

        test('deve retornar 400 para ID invalido', async () => {
            const resposta = await autenticar(
                request(app).put('/api/chamados/id-invalido')
            ).send({ status: 'RESOLVIDO' });

            expect(resposta.status).toBe(400);
        });

        test('deve retornar 404 quando nao existir', async () => {
            mockRepository.atualizar.mockResolvedValue(null);

            const resposta = await autenticar(
                request(app).put(`/api/chamados/${ID_INEXISTENTE}`)
            ).send({ status: 'FECHADO' });

            expect(resposta.status).toBe(404);
        });

        test('CLIENTE nao deve alterar status', async () => {
            mockRepository.buscarPorId.mockResolvedValue(chamadoExemplo);

            const resposta = await autenticar(
                request(app).put(`/api/chamados/${ID_VALIDO}`),
                'CLIENTE',
                '4'
            ).send({ status: 'RESOLVIDO' });

            expect(resposta.status).toBe(403);
            expect(mockRepository.atualizar).not.toHaveBeenCalled();
        });
    });

    describe('DELETE /api/chamados/:id', () => {
        test('ADMIN deve excluir um chamado', async () => {
            mockRepository.excluir.mockResolvedValue(chamadoExemplo);

            const resposta = await autenticar(
                request(app).delete(`/api/chamados/${ID_VALIDO}`)
            );

            expect(resposta.status).toBe(200);
            expect(resposta.body.mensagem).toBe(
                'Chamado excluído com sucesso.'
            );
        });

        test('deve retornar 400 para ID invalido', async () => {
            const resposta = await autenticar(
                request(app).delete('/api/chamados/id-invalido')
            );

            expect(resposta.status).toBe(400);
            expect(mockRepository.excluir).not.toHaveBeenCalled();
        });

        test('deve retornar 404 quando nao existir', async () => {
            mockRepository.excluir.mockResolvedValue(null);

            const resposta = await autenticar(
                request(app).delete(`/api/chamados/${ID_INEXISTENTE}`)
            );

            expect(resposta.status).toBe(404);
        });

        test('CLIENTE nao deve excluir chamado', async () => {
            const resposta = await autenticar(
                request(app).delete(`/api/chamados/${ID_VALIDO}`),
                'CLIENTE',
                '4'
            );

            expect(resposta.status).toBe(403);
            expect(mockRepository.excluir).not.toHaveBeenCalled();
        });

        test('ATENDENTE nao deve excluir chamado', async () => {
            const resposta = await autenticar(
                request(app).delete(`/api/chamados/${ID_VALIDO}`),
                'ATENDENTE',
                '3'
            );

            expect(resposta.status).toBe(403);
            expect(mockRepository.excluir).not.toHaveBeenCalled();
        });
    });
});