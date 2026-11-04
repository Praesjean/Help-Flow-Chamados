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

class ChamadoController {
    async criar(req, res) {
        try {
            const chamado = await createChamadoUseCase.execute(req.body);

            return res.status(201).json({
                mensagem: 'Chamado criado com sucesso.',
                chamado
            });
        } catch (error) {
            if (
                error.name === 'ValidationError' ||
                error.name === 'CastError' ||
                error.message.includes('obrigatórios') ||
                error.message === 'Prioridade inválida.'
            ) {
                return res.status(400).json({
                    erro: error.message
                });
            }

            console.error('Erro ao criar chamado:', error);

            return res.status(500).json({
                erro: 'Erro interno ao criar chamado.'
            });
        }
    }

    async listar(req, res) {
        try {
            const chamados = await listChamadosUseCase.execute();

            return res.status(200).json(chamados);
        } catch (error) {
            console.error('Erro ao listar chamados:', error);

            return res.status(500).json({
                erro: 'Erro interno ao listar chamados.'
            });
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

            return res.status(200).json(chamado);
        } catch (error) {
            console.error('Erro ao buscar chamado:', error);

            return res.status(500).json({
                erro: 'Erro interno ao buscar chamado.'
            });
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

            const chamado = await updateChamadoUseCase.execute(id, req.body);

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
            if (
                error.name === 'ValidationError' ||
                error.message.includes('inválid') ||
                error.message.includes('não pode estar vazio')
            ) {
                return res.status(400).json({
                    erro: error.message
                });
            }

            console.error('Erro ao atualizar chamado:', error);

            return res.status(500).json({
                erro: 'Erro interno ao atualizar chamado.'
            });
        }
    }

    async excluir(req, res) {
        try {
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
            console.error('Erro ao excluir chamado:', error);

            return res.status(500).json({
                erro: 'Erro interno ao excluir chamado.'
            });
        }
    }
}

module.exports = new ChamadoController();