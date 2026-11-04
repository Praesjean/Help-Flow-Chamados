const request = require('supertest');

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

const app = require('../../src/app');

const ID_VALIDO = '507f1f77bcf86cd799439011';
const ID_INEXISTENTE = '507f1f77bcf86cd799439012';

const chamadoExemplo = {
	_id: ID_VALIDO,
	titulo: 'Erro no login',
	descricao: 'Não consigo acessar o sistema.',
	status: 'ABERTO',
	prioridade: 'ALTA',
	usuarioId: 'usuario-001'
};

describe('API de Chamados', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /api/chamados', () => {
		test('deve criar um chamado e retornar 201', async () => {
			mockRepository.criar.mockResolvedValue(chamadoExemplo);

			const resposta = await request(app)
				.post('/api/chamados')
				.send({
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

		test('deve retornar 400 quando faltar título', async () => {
			const resposta = await request(app)
				.post('/api/chamados')
				.send({
					descricao: 'Problema no sistema',
					usuarioId: 'usuario-001'
				});

			expect(resposta.status).toBe(400);
			expect(mockRepository.criar).not.toHaveBeenCalled();
		});

		test('deve retornar 400 para prioridade inválida', async () => {
			const resposta = await request(app)
				.post('/api/chamados')
				.send({
					titulo: 'Erro',
					descricao: 'Problema',
					prioridade: 'URGENTE',
					usuarioId: 'usuario-001'
				});

			expect(resposta.status).toBe(400);
			expect(mockRepository.criar).not.toHaveBeenCalled();
		});
	});

	describe('GET /api/chamados', () => {
		test('deve listar os chamados e retornar 200', async () => {
			mockRepository.listar.mockResolvedValue([chamadoExemplo]);

			const resposta = await request(app)
				.get('/api/chamados');

			expect(resposta.status).toBe(200);
			expect(resposta.body).toHaveLength(1);
			expect(resposta.body[0].titulo).toBe('Erro no login');
		});

		test('deve retornar uma lista vazia', async () => {
			mockRepository.listar.mockResolvedValue([]);

			const resposta = await request(app)
				.get('/api/chamados');

			expect(resposta.status).toBe(200);
			expect(resposta.body).toEqual([]);
		});
	});

	describe('GET /api/chamados/:id', () => {
		test('deve buscar um chamado existente', async () => {
			mockRepository.buscarPorId.mockResolvedValue(chamadoExemplo);

			const resposta = await request(app)
				.get(`/api/chamados/${ID_VALIDO}`);

			expect(resposta.status).toBe(200);
			expect(resposta.body._id).toBe(ID_VALIDO);
		});

		test('deve retornar 400 para ID inválido', async () => {
			const resposta = await request(app)
				.get('/api/chamados/id-invalido');

			expect(resposta.status).toBe(400);
			expect(mockRepository.buscarPorId).not.toHaveBeenCalled();
		});

		test('deve retornar 404 quando o chamado não existir', async () => {
			mockRepository.buscarPorId.mockResolvedValue(null);

			const resposta = await request(app)
				.get(`/api/chamados/${ID_INEXISTENTE}`);

			expect(resposta.status).toBe(404);
		});
	});

	describe('PUT /api/chamados/:id', () => {
		test('deve atualizar um chamado e retornar 200', async () => {
			mockRepository.atualizar.mockResolvedValue({
				...chamadoExemplo,
				status: 'RESOLVIDO'
			});

			const resposta = await request(app)
				.put(`/api/chamados/${ID_VALIDO}`)
				.send({ status: 'RESOLVIDO' });

			expect(resposta.status).toBe(200);
			expect(resposta.body.chamado.status).toBe('RESOLVIDO');
		});

		test('deve retornar 400 para status inválido', async () => {
			const resposta = await request(app)
				.put(`/api/chamados/${ID_VALIDO}`)
				.send({ status: 'CANCELADO' });

			expect(resposta.status).toBe(400);
			expect(mockRepository.atualizar).not.toHaveBeenCalled();
		});

		test('deve retornar 400 para ID inválido', async () => {
			const resposta = await request(app)
				.put('/api/chamados/id-invalido')
				.send({ status: 'RESOLVIDO' });

			expect(resposta.status).toBe(400);
		});

		test('deve retornar 404 quando o chamado não existir', async () => {
			mockRepository.atualizar.mockResolvedValue(null);

			const resposta = await request(app)
				.put(`/api/chamados/${ID_INEXISTENTE}`)
				.send({ status: 'FECHADO' });

			expect(resposta.status).toBe(404);
		});
	});

	describe('DELETE /api/chamados/:id', () => {
		test('deve excluir um chamado e retornar 200', async () => {
			mockRepository.excluir.mockResolvedValue(chamadoExemplo);

			const resposta = await request(app)
				.delete(`/api/chamados/${ID_VALIDO}`);

			expect(resposta.status).toBe(200);
			expect(resposta.body.mensagem).toBe(
				'Chamado excluído com sucesso.'
			);
		});

		test('deve retornar 400 para ID inválido', async () => {
			const resposta = await request(app)
				.delete('/api/chamados/id-invalido');

			expect(resposta.status).toBe(400);
			expect(mockRepository.excluir).not.toHaveBeenCalled();
		});

		test('deve retornar 404 quando o chamado não existir', async () => {
			mockRepository.excluir.mockResolvedValue(null);

			const resposta = await request(app)
				.delete(`/api/chamados/${ID_INEXISTENTE}`);

			expect(resposta.status).toBe(404);
		});
	});
});