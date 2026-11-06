const mongoose = require('mongoose');

const ChamadoRepository = require('../../infrastructure/repositories/ChamadoRepository');

const CreateChamadoUseCase = require('../../application/features/createChamado/CreateChamadoUseCase');
const ListChamadosUseCase = require('../../application/features/listChamados/ListChamadosUseCase');
const GetChamadoUseCase = require('../../application/features/getChamado/GetChamadoUseCase');
const UpdateChamadoUseCase = require('../../application/features/updateChamado/UpdateChamadoUseCase');
const DeleteChamadoUseCase = require('../../application/features/deleteChamado/DeleteChamadoUseCase');

const chamadoRepository = new ChamadoRepository();

const createChamadoUseCase = new CreateChamadoUseCase(chamadoRepository);
const listChamadosUseCase = new ListChamadosUseCase(chamadoRepository);
const getChamadoUseCase = new GetChamadoUseCase(chamadoRepository);
const updateChamadoUseCase = new UpdateChamadoUseCase(chamadoRepository);
const deleteChamadoUseCase = new DeleteChamadoUseCase(chamadoRepository);

function tratarErro(res, error, operacao) {
    if (error.status === 401 || error.status === 403) {
        return res.status(error.status).json({
            erro: error.message
        });
    }

    if (
        error.name === 'ValidationError' ||
        error.name === 'CastError' ||
        error.message?.includes('obrigatórios') ||
        error.message?.includes('inválid') ||
        error.message?.includes('não pode estar vazio')
    ) {
        return res.status(400).json({
            erro: error.message
        });
    }

    console.error(`Erro ao ${operacao} chamado:`, error);

    return res.status(500).json({
        erro: `Erro interno ao ${operacao} chamado.`
    });
}

class ChamadoController {
    async criar(req, res) {
        try {
            const dados = { ...req.body };

            if (req.usuario.perfil === 'CLIENTE') {
                dados.usuarioId = req.usuario.id;
            }

            const chamado = await createChamadoUseCase.execute(dados);

            return res.status(201).json({
                mensagem: 'Chamado criado com sucesso.',
                chamado
            });
        } catch (error) {
            return tratarErro(res, error, 'criar');
        }
    }

    async listar(req, res) {
        try {
            const chamados = await listChamadosUseCase.execute(req.usuario);

            return res.status(200).json(chamados);
        } catch (error) {
            return tratarErro(res, error, 'listar');
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    erro: 'ID do chamado inválido.'
                });
            }

            const chamado = await getChamadoUseCase.execute(id);

            if (!chamado) {
                return res.status(404).json({
                    erro: 'Chamado não encontrado.'
                });
            }

            if (
                req.usuario.perfil === 'CLIENTE' &&
                String(chamado.usuarioId) !== req.usuario.id
            ) {
                return res.status(403).json({
                    erro: 'Você não possui permissão para consultar este chamado.'
                });
            }

            return res.status(200).json(chamado);
        } catch (error) {
            return tratarErro(res, error, 'consultar');
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    erro: 'ID do chamado inválido.'
                });
            }

            const chamadoExistente = await getChamadoUseCase.execute(id);

            if (!chamadoExistente) {
                return res.status(404).json({
                    erro: 'Chamado não encontrado.'
                });
            }

            if (
                req.usuario.perfil === 'CLIENTE' &&
                String(chamadoExistente.usuarioId) !== req.usuario.id
            ) {
                return res.status(403).json({
                    erro: 'Você não possui permissão para atualizar este chamado.'
                });
            }

            const dados = { ...req.body };

            if (
                req.usuario.perfil === 'CLIENTE' &&
                Object.prototype.hasOwnProperty.call(dados, 'status')
            ) {
                return res.status(403).json({
                    erro: 'Clientes não possuem permissão para alterar o status dos chamados.'
                });
            }

            delete dados.usuarioId;

            const chamado = await updateChamadoUseCase.execute(id, dados);

            if (!chamado) {
                return res.status(404).json({
                    erro: 'Chamado não encontrado.'
                });
            }

            return res.status(200).json({
                mensagem: 'Chamado atualizado com sucesso.',
                chamado
            });
        } catch (error) {
            return tratarErro(res, error, 'atualizar');
        }
    }

    async excluir(req, res) {
        try {
            if (req.usuario.perfil !== 'ADMIN') {
                return res.status(403).json({
                    erro: 'Somente administradores podem excluir chamados.'
                });
            }

            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    erro: 'ID do chamado inválido.'
                });
            }

            const chamado = await deleteChamadoUseCase.execute(id);

            if (!chamado) {
                return res.status(404).json({
                    erro: 'Chamado não encontrado.'
                });
            }

            return res.status(200).json({
                mensagem: 'Chamado excluído com sucesso.'
            });
        } catch (error) {
            return tratarErro(res, error, 'excluir');
        }
    }
}

module.exports = new ChamadoController();